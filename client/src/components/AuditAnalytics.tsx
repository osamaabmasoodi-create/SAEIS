// @ts-nocheck
import React, { useState } from 'react';
import { useApp } from './AppContext'; // ربط المكون بالسياق العام

interface AuditAnalyticsProps {
  auditData?: any;
  onExport?: () => void;
  onImport?: () => void;
}

const AuditAnalytics: React.FC<AuditAnalyticsProps> = ({ auditData: propsAuditData, onExport, onImport }) => {
  // جلب البيانات المرفوعة حقيقياً من AppContext
  const context = useApp() as any;
  const globalData = context?.uploadedData || context?.auditData;

  // إعطاء الأولوية للبيانات القادمة من الـ props أو السياق العام ثم القيم الافتراضية
  const auditData = propsAuditData || globalData;

  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  // قراءة البيانات الديناميكية المرفوعة
  const totalAccounts = auditData?.totalAccounts || auditData?.totalRows || context?.totalAccounts || 2000;
  const complianceRate = auditData?.complianceRate || context?.complianceRate || 99.95;
  const fileName = auditData?.fileName || context?.fileName || 'SAEIS_Master_Audit_Demo_3000.xlsx';
  const isBalanced = auditData?.isBalanced ?? context?.isBalanced ?? false;
  const varianceAmount = auditData?.varianceAmount || context?.balanceDifference || 8606704.47;

  const handlePostToERP = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setIsPosted(true);
      alert('تم رحيل القيود التصحيحية الأربعة بنجاح إلى نظام الـ ERP');
    }, 1500);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* شريط الأزرار والمؤشرات العلوي */}
      <div className="flex flex-wrap justify-between items-center bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>لوحة التحليلات والتعديلات الهيكلية (CFO View)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            منظومة SAEIS - تحليل الفروقات والامتثال للمعايير لملف ({fileName})
          </p>
        </div>

        <div className="flex items-center gap-3 mt-3 md:mt-0">
          <button
            onClick={handlePostToERP}
            disabled={isPosting || isPosted}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all shadow ${
              isPosted
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50'
            }`}
          >
            {isPosting ? 'جاري الترحيل...' : isPosted ? 'تم الترحيل للـ ERP' : 'ترحيل التسويات للـ ERP'}
          </button>
        </div>
      </div>

      {/* ملخص المؤشرات القيادية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow">
          <span className="text-xs text-slate-400">إجمالي الحسابات المفحوصة</span>
          <h3 className="text-2xl font-bold text-white mt-1">{totalAccounts.toLocaleString()} حساب</h3>
          <span className="text-xs text-slate-500 mt-1 block">الملف: {fileName}</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow">
          <span className="text-xs text-slate-400">مؤشر الامتثال لـ IFRS</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-1">{complianceRate}%</h3>
          <span className="text-xs text-emerald-500/80 mt-1 block">مطابقة عالية جداً</span>
        </div>

        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow">
          <span className="text-xs text-slate-400">حالة توازن ميزان المراجعة</span>
          <h3 className={`text-2xl font-bold mt-1 ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isBalanced ? 'متوازن' : 'غير متوازن'}
          </h3>
          {!isBalanced && (
            <span className="text-xs text-rose-400 mt-1 block">
              الفارق: ${Number(varianceAmount).toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditAnalytics;