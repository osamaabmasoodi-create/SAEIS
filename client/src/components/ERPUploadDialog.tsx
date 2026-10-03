import React, { useState } from 'react';
import { parseExcelFile } from '../lib/excelService';

interface ERPUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded?: (data: any[]) => void;
}

export default function ERPUploadDialog({ isOpen, onClose, onDataLoaded }: ERPUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUploadProcess = async () => {
    if (!selectedFile) {
      alert('يرجى اختيار ملف Excel / CSV أولاً.');
      return;
    }

    try {
      setLoading(true);
      const parsedData = await parseExcelFile(selectedFile);

      if (onDataLoaded) {
        onDataLoaded(parsedData);
      }

      alert(`تم استيراد الملف "${selectedFile.name}" بنجاح وتحديث ${parsedData.length} سجل.`);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("خطأ أثناء قراءة ملف Excel:", error);
      alert("حدث خطأ أثناء قراءة الملف، تأكد من صحة التنسيق.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1f2937] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <h3 className="text-lg font-bold text-white">رفع ملف البيانات (Excel / CSV)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-4">
          <label className="block text-sm text-slate-300 mb-2">اختر ملف البيانات</label>
          <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition">
            <input
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-input"
            />
            <label htmlFor="file-upload-input" className="cursor-pointer">
              {selectedFile ? (
                <span className="text-emerald-400 font-semibold">{selectedFile.name}</span>
              ) : (
                <span className="text-slate-400">اسحب الملف هنا أو انقر لاختيار ملف Excel / CSV</span>
              )}
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-700 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            إلغاء
          </button>
          <button
            onClick={handleUploadProcess}
            disabled={loading || !selectedFile}
            className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {loading ? 'جاري المعالجة والتدقيق...' : 'بدء المعالجة'}
          </button>
        </div>
      </div>
    </div>
  );
}