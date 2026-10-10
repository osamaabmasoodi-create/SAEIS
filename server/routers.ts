import { Router } from 'express';
import multer from 'multer'; // مكتبة رفع الملفات في Node.js

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // تخزين الملف مؤقتاً في الذاكرة (Buffer)

// دالة حساب المؤشرات الحقيقية (التي اعتمدناها)
async function calculateRealCFOmetrics(fileBuffer: Buffer, fileName: string) {
  const XLSX = require('xlsx');
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet);

  let totalDebit = 0;
  let totalCredit = 0;
  let violationCount = 0;
  const totalAccounts = rawData.length;

  rawData.forEach((row: any) => {
    const debitKeys = Object.keys(row).filter(k => k.toLowerCase().includes('debit') || k.includes('مدين'));
    const creditKeys = Object.keys(row).filter(k => k.toLowerCase().includes('credit') || k.includes('دائن'));

    const debitVal = debitKeys.length > 0 ? Number(row[debitKeys[0]]) || 0 : 0;
    const creditVal = creditKeys.length > 0 ? Number(row[creditKeys[0]]) || 0 : 0;

    totalDebit += debitVal;
    totalCredit += creditVal;

    if (debitVal !== creditVal && debitVal > 0 && creditVal > 0) {
      violationCount++;
    }
  });

  const balanceDifference = Math.round((totalDebit - totalCredit) * 100) / 100;

  const complianceRate = totalAccounts > 0 
    ? Math.round(((totalAccounts - violationCount) / totalAccounts) * 10000) / 100 
    : 100;

  return {
    fileName,
    totalAccounts,
    totalDebit,
    totalCredit,
    balanceDifference,
    violationsCount: violationCount,
    complianceRate: `${complianceRate}%`,
    isCleanFile: balanceDifference === 0 && violationCount === 0
  };
}

// مسار استقبال ومعالجة الملف وإرجاع النتائج الحقيقية للـ Frontend
router.post('/api/audit/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم إرفاق أي ملف.' });
    }

    const metrics = await calculateRealCFOmetrics(req.file.buffer, req.file.originalname);
    
    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error processing audit file:', error);
    return res.status(500).json({ error: 'حدث خطأ أثناء معالجة وقراءة الملف في الخادم.' });
  }
});

export default router;