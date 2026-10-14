import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// دالة حساب المؤشرات الحقيقية مع دعم فحص كافة أوراق العمل (Sheets)
async function calculateRealCFOmetrics(fileBuffer: Buffer, fileName: string) {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  let globalTotalDebit = 0;
  let globalTotalCredit = 0;
  let globalTotalRows = 0;
  let globalViolationCount = 0;
  const observations: any[] = [];

  workbook.SheetNames.forEach((sheetName: string) => {
    const worksheet = workbook.Sheets[sheetName];
    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);
    
    if (rawData.length === 0) return;

    let sheetDebit = 0;
    let sheetCredit = 0;
    let sheetViolations = 0;

    rawData.forEach((row: any) => {
      const debitKeys = Object.keys(row).filter(k => k.toLowerCase().includes('debit') || k.includes('مدين'));
      const creditKeys = Object.keys(row).filter(k => k.toLowerCase().includes('credit') || k.includes('دائن'));

      const debitVal = debitKeys.length > 0 ? Number(row[debitKeys[0]]) || 0 : 0;
      const creditVal = creditKeys.length > 0 ? Number(row[creditKeys[0]]) || 0 : 0;

      sheetDebit += debitVal;
      sheetCredit += creditVal;

      if (Math.abs(debitVal - creditVal) > 0.01 && (debitVal > 0 || creditVal > 0)) {
        sheetViolations++;
      }
    });

    const sheetDiff = Math.round((sheetDebit - sheetCredit) * 100) / 100;
    
    globalTotalDebit += sheetDebit;
    globalTotalCredit += sheetCredit;
    globalTotalRows += rawData.length;
    globalViolationCount += sheetViolations;

    // تسجيل ملاحظة خاصة بكل ورقة عمل غير متوازنة
    if (Math.abs(sheetDiff) > 0.01) {
      observations.push({
        standard: 'IAS 1 - عرض القوائم المالية',
        title: `عدم توازن في ورقة [${sheetName}]`,
        details: `إجمالي حركة المدين ($${sheetDebit.toLocaleString()}) لا تتطابق مع إجمالي الدائن ($${sheetCredit.toLocaleString()}). الفارق المكتشف هو $${Math.abs(sheetDiff).toLocaleString()}`,
        difference: Math.abs(sheetDiff)
      });
    }
  });

  const overallBalanceDiff = Math.round((globalTotalDebit - globalTotalCredit) * 100) / 100;
  const complianceRate = globalTotalRows > 0 
    ? Math.max(0, Math.round(((globalTotalRows - globalViolationCount) / globalTotalRows) * 10000) / 100) 
    : 100;

  return {
    fileName,
    totalAccounts: globalTotalRows,
    totalDebit: globalTotalDebit,
    totalCredit: globalTotalCredit,
    balanceDifference: overallBalanceDiff,
    violationsCount: globalViolationCount,
    complianceRate: `${complianceRate}%`,
    observations: observations,
    isCleanFile: overallBalanceDiff === 0 && globalViolationCount === 0
  };
}

// مسار استقبال ومعالجة الملف المرفوع
router.post('/api/audit/upload-file', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم إرفاق أي ملف' });
    }

    const metrics = await calculateRealCFOmetrics(req.file.buffer, req.file.originalname);

    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error processing audit file:', error);
    return res.status(500).json({ error: 'حدث خطأ أثناء قراءة الملف في الخادم' });
  }
});

export default router;