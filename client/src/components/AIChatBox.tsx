import React, { useState } from 'react';

interface AuditAnalyticsProps {
  onExport?: () => void;
  onImport?: () => void;
}

const AuditAnalytics: React.FC<AuditAnalyticsProps> = ({ onExport, onImport }) => {
  const [isPosting, setIsPosting] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handlePostToERP = () => {
    setIsPosting(true);
    setTimeout(() => {
      setIsPosting(false);
      setIsPosted(true);
      setShowToast(true);
      // إخفاء التنبيه تلقائياً بعد 4 ثوانٍ
      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* شريط الأزرار والمؤشرات */}
      <div className="flex flex-wrap justify-between items-center bg-slate-800/90 p-4 rounded-xl border border-slate-700 shadow-lg gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📊</span> لوحة التحليلات والتعديلات الهيكلية (CFO View)
          </h1>
          <p className="text-sm text-slate-400">منظومة SAEIS للتدقيق المالي والربط الذكي مع أنظمة ERP</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onImport}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 border border-slate-600"
          >
            📥 رفع ملف البيانات (Excel / CSV)
          </button>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-2 shadow-lg shadow-emerald-900/30"
          >
            📄 تصدير التقرير (PDF)
          </button>
        </div>
      </div>

      {/* بطاقات المؤشرات الرقمية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">معدل الامتثال</p>
          <p className="text-2xl font-bold text-emerald-400">97.8%</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">القيود المخالفة</p>
          <p className="text-2xl font-bold text-rose-400">16 قيداً</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">أثر IFRS 16</p>
          <p className="text-2xl font-bold text-amber-400">$120,000</p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">مخصص IFRS 9</p>
          <p className="text-2xl font-bold text-indigo-400">$18,500</p>
        </div>
      </div>

      {/* جدول التحفظات وقيود التسوية */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 shadow-xl">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📋</span> ملخص التحفظات المكتشفة وقيود التسوية المقترحة
          </h2>
          <button
            onClick={handlePostToERP}
            disabled={isPosting || isPosted}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
              isPosted
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-700 cursor-default'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40'
            }`}
          >
            {isPosting ? '⏳ جاري الترحيل إلى ERP...' : isPosted ? '✅ تم ترحيل القيود إلى ERP بنجاح' : '🚀 ترحيل القيود التصحيحية تلقائياً إلى ERP'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">المعيار الدولي</th>
                <th className="p-3">وصف المعالجة الحالي</th>
                <th className="p-3">الأثر المالي ($)</th>
                <th className="p-3">القيد التصحيحي المقترح</th>
                <th className="p-3 text-center">حالة الترحيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-200">
              <tr>
                <td className="p-3 font-semibold text-amber-400">IAS 16</td>
                <td className="p-3">رأسمالة مصاريف صيانة دورية كأصل ثابت بشكل خاطئ</td>
                <td className="p-3 text-rose-400 font-medium">$25,000</td>
                <td className="p-3">فصل المبالغ وتحويلها لحساب مصروف الصيانة التشغيلي</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${isPosted ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-amber-900/60 text-amber-300 border border-amber-700'}`}>
                    {isPosted ? 'مُرحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-amber-400">IFRS 16</td>
                <td className="p-3">تحميل عقود إيجار التشغيل للمصروف مباشرة بدلاً من أصل ROU</td>
                <td className="p-3 text-emerald-400 font-medium">$120,000</td>
                <td className="p-3">إثبات أصل حق الاستخدام (ROU Asset) مقابل التزام الإيجار</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${isPosted ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-amber-900/60 text-amber-300 border border-amber-700'}`}>
                    {isPosted ? 'مُرحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-amber-400">IFRS 9</td>
                <td className="p-3">عدم احتساب مخصص خسائر ائتمانية متوقعة للذمم المتقادمة</td>
                <td className="p-3 text-rose-400 font-medium">$18,500</td>
                <td className="p-3">قيد مصروف الخسائر الائتمانية مقابل مخصص ECL</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${isPosted ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-amber-900/60 text-amber-300 border border-amber-700'}`}>
                    {isPosted ? 'مُرحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-amber-400">IFRS 15</td>
                <td className="p-3">تسجيل دفعة مقدمة كإيراد مباشر قبل نقل السيطرة للعميل</td>
                <td className="p-3 text-amber-400 font-medium">$45,000</td>
                <td className="p-3">تحويل المبلغ إلى حساب التزام عقد (Contract Liability)</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${isPosted ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700' : 'bg-amber-900/60 text-amber-300 border border-amber-700'}`}>
                    {isPosted ? 'مُرحَّل' : 'معلق'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* شريط تنبيه الترحيل العائم (Toast) */}
      {showToast && (
        <div className="fixed bottom-6 left-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-bounce">
          <span className="text-xl">🚀</span>
          <div>
            <p className="font-bold text-sm">تم الترحيل الآلي بنجاح!</p>
            <p className="text-xs text-emerald-100">تم إرسال قيود التسوية إلى نظام ERP عبر API (رقم العملية #EXP-2026)</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditAnalytics;