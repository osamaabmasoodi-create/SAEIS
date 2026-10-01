import React, { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

interface FileUploadModalProps {
  onDataLoaded?: (data: any[]) => void;
}

export function FileUploadModal({ onDataLoaded }: FileUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // محاكاة رفع ومعالجة ملف الإكسيل
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setSuccessMessage(null);

    setTimeout(() => {
      setIsUploading(false);
      setSuccessMessage(`تم استيراد الملف "${file.name}" بنجاح وتوليد 1,240 قيداً للفحص الآلي.`);
      if (onDataLoaded) onDataLoaded([]);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-md font-bold text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
          استيراد ميزان المراجع / القيود اليومية (Excel / CSV)
        </h3>
        <span className="text-xs text-slate-400 font-mono">IAS / IFRS Audit Ingestion</span>
      </div>

      <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-8 text-center transition-all bg-slate-950/50">
        <Upload className="h-10 w-10 text-slate-500 mx-auto mb-3" />
        <p className="text-sm text-slate-300 font-medium">اسحب ملف الإكسيل هنا أو اضغط للاختيار من جهازك</p>
        <p className="text-xs text-slate-500 mt-1">يدعم صيغ (.xlsx, .xls, .csv) المخرجة من Onyx Pro أو Odoo أو Excel</p>
        
        <input 
          type="file" 
          accept=".xlsx, .xls, .csv" 
          onChange={handleFileUpload} 
          className="hidden" 
          id="excel-upload-input"
        />
        
        <label 
          htmlFor="excel-upload-input"
          className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-5 py-2.5 rounded-lg font-semibold cursor-pointer transition-all shadow-lg shadow-emerald-950"
        >
          {isUploading ? "جاري قراءة ومعالجة الصفوف..." : "اختر ملف القيود"}
        </label>
      </div>

      {successMessage && (
        <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs p-3.5 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          {successMessage}
        </div>
      )}
    </div>
  );
}