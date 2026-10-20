import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';

const router = Router();

// إعداد التخزين المؤقت لملفات الإكسل المرفوعة عبر Multer
const upload = multer({ storage: multer.memoryStorage() });

// مسار استقبال ومعالجة ميزان المراجعة
router.post('/upload-trial-balance', upload.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'لم يتم إرفاق أي ملف.' });
    }

    // قراءة الملف من الذاكرة المؤقتة
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const totalRows = jsonData.length;

    // تحليل وإرجاع النتائج للواجهة الأمامية
    return res.status(200).json({
      success: true,
      message: 'تم تحليل ومعالجة ميزان المراجعة بنجاح عبر السيرفر الخلفي',
      fileName: req.file.originalname,
      totalAccounts: totalRows,
      dataSummary: jsonData.slice(0, 5) // عينة أولية من البيانات
    });

  } catch (error) {
    console.error('Error parsing Excel file:', error);
    return res.status(500.0).json({ error: 'حدث خطأ أثناء معالجة ملف الإكسل في السيرفر.' });
  }
});

export default router;