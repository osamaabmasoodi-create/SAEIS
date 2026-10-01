import React, { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, FileText, Database } from 'lucide-react';

interface ERPUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export const ERPUploadDialog: React.FC<ERPUploadDialogProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [erpType, setErpType] = useState<string>('onyx');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    // محاكاة عملية رفع الملف والمعالجة
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFile(null);
        if (onUploadSuccess) onUploadSuccess();
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm dir-rtl">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-right">
        {/* زر الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
            <Database size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">استيراد بيانات من ERP</h3>
            <p className="text-xs text-gray-400">رفع ميزان المراجعة أو القوائم المالية المباشرة</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle size={48} className="text-emerald-500 animate-bounce" />
            <h4 className="text-lg font-bold text-white">تم الاستيراد بنجاح!</h4>
            <p className="text-xs text-gray-400">جاري مطابقة البيانات مع معايير IFRS...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* اختيار نظام ERP */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                اختر نظام الـ ERP:
              </label>
              <select
                value={erpType}
                onChange={(e) => setErpType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="onyx">Onyx Pro (أونكس برو)</option>
                <option value="odoo">Odoo ERP</option>
                <option value="sap">SAP Business One</option>
                <option value="oracle">Oracle Financials</option>
                <option value="excel">ملف Excel / CSV عام</option>
              </select>
            </div>

            {/* منطقة رفع الملف */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                ملف البيانات (Excel, CSV, XML):
              </label>
              <div className="border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-gray-850 relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".xlsx, .xls, .csv, .xml"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-2">
                  <Upload size={32} className="text-blue-400" />
                  {file ? (
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <FileText size={16} />
                      {file.name}
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-300">
                        اسحب الملف هنا أو اضغط للاختيار
                      </p>
                      <p className="text-xs text-gray-500">يدعم ملفات XLSX, CSV بحد أقصى 25MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* زر الإرسال */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!file || isUploading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري الاستيراد والتحليل...
                  </>
                ) : (
                  'بدء الاستيراد والربط'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ERPUploadDialog;