// مكتبة قراءة ومعالجة ملفات Excel و CSV لمنظومة SAEIS
import * as XLSX from 'xlsx';

export const parseExcelOrCsvFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

// إضافة الدالة بالاسم الذي تطلبه المكونات لتجنب أي خطأ
export const parseExcelFile = parseExcelOrCsvFile;