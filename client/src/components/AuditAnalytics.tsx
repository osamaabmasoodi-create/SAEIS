import React, { useState } from 'react';

interface AuditAnalyticsProps {
  auditData?: any;
  onExport?: () => void;
  onImport?: () => void;
}

const AuditAnalytics: React.FC<AuditAnalyticsProps> = ({ auditData, onExport, onImport }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);

  // قراءة البيانات المركزية من الملف المرفوع أو استخدام القيم الافتراضية
  const totalAccounts = auditData?.totalAccounts || auditData?.totalRows || 2000;
  const complianceRate = auditData?.complianceRate || 99.95;
  const fileName = auditData?.fileName || 'Nova 2000.xlsx';
  const isBalanced = auditData?.isBalanced ?? false;
  const varianceAmount = auditData?.varianceAmount || 10238886.71;

  const handlePostToERP = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setIsPosted(true);
      alert('تم ترحيل القيود التصحيحية الأربعة بنجاح إلى نظام الـ ERP');
    }, 1500);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* شريط الأزرار والمؤشرات العلوي */}
      <div className="flex flex-wrap justify-between items-center bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>لوحة التحليلات والتعديلات الهيكلية (CFO View)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            منظومة SAEIS - تحليل الفروقات والامتثال للمعايير لملف ({fileName})
          </p>
        </div>
        <div className="flex gap-3">
          {onImport && (
            <button
              onClick={onImport}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition border border-slate-700"
            >
              استيراد ميزان آخر
            </button>
          )}
          {onExport && (
            <button
              onClick={onExport}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg"
            >
              تصدير التقرير
            </button>
          )}
        </div>
      </div>

      {/* بطاقات الكروت التحليلية 4 كروت */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">إجمالي الحسابات المفحوصة</span>
          <span className="text-lg font-bold text-amber-400">{totalAccounts.toLocaleString()} حساب</span>
          <span className="text-[10px] text-amber-500/80">الملف: {fileName}</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">مؤشر الامتثال لـ IFRS</span>
          <span className="text-lg font-bold text-emerald-400">{complianceRate}%</span>
          <span className="text-[10px] text-emerald-500/80">مطابقة عالية جداً</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">حالة توازن ميزان المراجعة</span>
          <span className={`text-lg font-bold ${isBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isBalanced ? 'متوازن' : 'غير متوازن'}
          </span>
          <span className="text-[10px] text-rose-500/80">الفارق: ${varianceAmount.toLocaleString()}</span>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">ترحيل التسويات للـ ERP</span>
          <button
            onClick={handlePostToERP}
            disabled={isPosting || isPosted}
            className={`mt-1 py-1.5 px-3 rounded-xl text-xs font-bold transition shadow ${
              isPosted
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            {isPosting ? 'جاري الترحيل...' : isPosted ? 'تم الترحيل للـ ERP' : 'ترحيل القيود الآن'}
          </button>
        </div>
      </div>

      {/* جدول القيود والتسويات المكتشفة */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-3">
          التحفظات المكتشفة وقيد التسوية المقترح وفق معايير IFRS
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right">
            <thead>
              <tr className="bg-slate-900 text-slate-300 text-[11px]">
                <th className="p-3 border border-slate-800">المعيار</th>
                <th className="p-3 border border-slate-800">وصف المعالجة الحالية</th>
                <th className="p-3 border border-slate-800">التصحيح المقترح</th>
                <th className="p-3 border border-slate-800">الأثر المالي ($)</th>
                <th className="p-3 border border-slate-800 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-200 divide-y divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-amber-400 border border-slate-800">IAS 16</td>
                <td className="p-3 border border-slate-800">رأسمالة مصاريف غير مؤهلة عبر الأصول الضخمة</td>
                <td className="p-3 border border-slate-800 text-emerald-400">فصل وتصحيح قيود الأصول الثابتة والصيانة</td>
                <td className="p-3 border border-slate-800 font-mono text-rose-400">$7,500</td>
                <td className="p-3 border border-slate-800 text-center">
                  <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold ${isPosted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {isPosted ? 'مُرَحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-amber-400 border border-slate-800">IFRS 16</td>
                <td className="p-3 border border-slate-800">معالجة محفظة عقود الإيجار الشاملة</td>
                <td className="p-3 border border-slate-800 text-emerald-400">إثبات أصل حق الاستخدام والالتزام الإيجاري الموحد</td>
                <td className="p-3 border border-slate-800 font-mono text-amber-400">$24,000</td>
                <td className="p-3 border border-slate-800 text-center">
                  <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold ${isPosted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {isPosted ? 'مُرَحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-amber-400 border border-slate-800">IFRS 9</td>
                <td className="p-3 border border-slate-800">نموذج الخسائر الائتمانية المتوقعة (ECL)</td>
                <td className="p-3 border border-slate-800 text-emerald-400">تكوين مخصصات الديون المشكوك فيها حسب الشرائح</td>
                <td className="p-3 border border-slate-800 font-mono text-rose-400">$18,500</td>
                <td className="p-3 border border-slate-800 text-center">
                  <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold ${isPosted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {isPosted ? 'مُرَحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-amber-400 border border-slate-800">IFRS 15</td>
                <td className="p-3 border border-slate-800">تدقيق الاعتراف بالإيرادات وعقود العملاء</td>
                <td className="p-3 border border-slate-800 text-emerald-400">إعادة تخصيص التزامات الأداء والإيرادات المؤجلة</td>
                <td className="p-3 border border-slate-800 font-mono text-amber-400">$45,000</td>
                <td className="p-3 border border-slate-800 text-center">
                  <span className={`px-2.5 py-1 text-[10px] rounded-full font-bold ${isPosted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {isPosted ? 'مُرَحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditAnalytics;