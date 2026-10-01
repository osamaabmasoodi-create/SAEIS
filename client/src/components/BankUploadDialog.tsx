import { useState } from "react";
import { Database, Upload, CheckCircle, X } from "lucide-react";

interface BankUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BankUploadDialog({ open, onOpenChange }: BankUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setSuccess(false);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);

    setTimeout(() => {
      setIsUploading(false);
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setFile(null);
        alert(`تم رفع كشف الحساب "${file.name}" وبدء المطابقة الآلية!`);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-950 border border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative">
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute left-4 top-4 text-slate-400 hover:text-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Database className="h-5 w-5 text-sky-400" />
          <h3 className="text-lg font-bold">رفع كشوفات الحسابات البنكية</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          قم برفع كشف الحساب البنكي بمفهوم المطابقة الآلية مع دفاتر المؤسسة.
        </p>

        <div className="space-y-4 mb-6">
          <label className="border-2 border-dashed border-slate-800 hover:border-sky-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/50">
            <Upload className="h-8 w-8 text-sky-400 mb-2" />
            <span className="text-xs font-semibold text-slate-300">
              {file ? file.name : "اختر كشف الحساب (Excel / CSV / PDF)"}
            </span>
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv, .pdf" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>

          {file && (
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <span className="truncate max-w-[200px] text-slate-300">{file.name}</span>
              <span className="text-sky-400 font-medium">جاهز للرفع</span>
            </div>
          )}

          {success && (
            <div className="bg-sky-500/10 border border-sky-500/20 text-sky-400 p-3 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              تم بدء التسوية والمطابقة بنجاح!
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-slate-800 rounded-lg text-slate-400 text-xs hover:bg-slate-900"
          >
            إلغاء
          </button>

          <button 
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-medium"
          >
            {isUploading ? "جاري المعالجة..." : "بدء المطابقة البنكية"}
          </button>
        </div>
      </div>
    </div>
  );
}