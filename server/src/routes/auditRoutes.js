"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const XLSX = __importStar(require("xlsx"));
const router = (0, express_1.Router)();
// إعداد التخزين المؤقت لملفات الإكسل المرفوعة عبر Multer
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// مسار استقبال ومعالجة ميزان المراجعة
router.post('/upload-trial-balance', upload.single('file'), (req, res) => {
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
    }
    catch (error) {
        console.error('Error parsing Excel file:', error);
        return res.status(500.0).json({ error: 'حدث خطأ أثناء معالجة ملف الإكسل في السيرفر.' });
    }
});
exports.default = router;
