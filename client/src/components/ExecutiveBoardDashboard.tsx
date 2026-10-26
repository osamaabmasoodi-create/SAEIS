import React from 'react';

export default function ExecutiveBoardDashboard() {
  
  // دالة تصدير وتنزيل التقرير التنفيذي لمجلس الإدارة محلياً
  const handleExportBoardReport = () => {
    try {
      const reportContent = `
=====================================================
SAEIS - تقرير القيادة التنفيذية العليا (Executive Board Report)
=====================================================
تاريخ الإصدار: ${new Date().toLocaleString('ar-SA')}
مؤشر سلامة الحوكمة والامتثال: 88% (مستوى أمان مرتفع)
حالات حرجة تتطلب متابعة: 4 حالات (تشمل تدوير فواتير وضرورات صيانة غير مرسلة)
التدفق النقدي المتوقع للـ 90 يوماً القادمة: $110,000 (موقف السيولة آمن)
قيود التسوية المعلقة: $71,000 (في انتظار الترحيل على ERP)

توزيع مخاطر الامتثال المالي حسب المعيار (Risk Breakdown):
- IAS 16 (رسملة الأصول والصيانة): 35% متوسط
- IAS 2 (هبوط أسعار المخزون): 45% مرتفع
- IFRS 16 (التزامات الإيجار): 12% منخفض
- IFRS 9 (مخصصات التعثر الائتماني ECL): 8% منخفض

ملخص القرارات المعروضة على مجلس الإدارة:
1. اعتماد قيود التسوية المعلقة بقيمة 71,000$ قبل إغلاق القوائم المالية.
2. الموافقة على تكوين مخصص هبوط المخزون بقيمة 18,500$ لحماية صافي الأرباح.
3. مراجعة صلاحيات اعتماد الفواتير لمنع تجزئة القيود واستمرار الامتثال.
=====================================================
`;

      const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SAEIS_Executive_Board_Report_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert("تم تصدير وتنزيل التقرير التنفيذي لمجلس الإدارة بنجاح إلى جهازك.");
    } catch (error) {
      console.error("خطأ في التصدير:", error);
      alert("حدث خطأ أثناء محاولة تصدير التقرير.");
    }
  };

  return (
    <div className="flex flex-col gap-6 text-right font-sans h-full p-6 bg-slate-950 text-slate-100" dir="rtl">
      {/* رأس الشاشة التنفيذية */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
            لوحة القيادة التنفيذية العليا (Executive Board Dashboard)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ملخص استراتيجي عالي المستوى لمجلس الإدارة وكبار التنفيذيين لقياس سلامة الحوكمة والمخاطر دون الدخول في تفاصيل الأستاذ العام
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportBoardReport}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow cursor-pointer"
          >
            تصدير تقرير المجلس
          </button>
          <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            بيانات ERP مباشرة
          </span>
        </div>
      </div>

      {/* البطاقات الرئيسية ومؤشرات الأداء */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* مؤشر الحوكمة والامتثال */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-300">مؤشر سلامة الحوكمة والامتثال</h3>
          <div className="flex items-center justify-center my-4">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center text-2xl font-bold text-emerald-400 font-mono shadow-inner">
              88%
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold text-center bg-emerald-500/10 py-1 rounded-lg">
            مستوى أمان مرتفع
          </span>
        </div>

        {/* المخاطر المكتشفة */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-300">المخاطر المكتشفة</h3>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-rose-500 font-mono">4</span>
            <span className="text-xs text-slate-400 mr-2">حالات حرجة</span>
          </div>
          <p className="text-[11px] text-slate-400">
            تشمل تجزئة فواتير وقرارات صيانة غير مرسلة تتطلب متابعة فورية.
          </p>
        </div>

        {/* التعديلات المعلقة */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-300">التعديلات المعلقة</h3>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">$71,000</span>
          </div>
          <p className="text-[11px] text-slate-400">
            قيود تسوية معايير IFRS جاهزة للترحيل على النظام المالي.
          </p>
        </div>

        {/* موقف السيولة المتوقع */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-300">موقف السيولة المتوقع</h3>
          <div className="my-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">$110,000</span>
          </div>
          <p className="text-[11px] text-slate-400">
            صافي التدفق النقدي المتوقع للـ 90 يوماً القادمة.
          </p>
        </div>
      </div>

      {/* القسم السفلي: توزيع المخاطر وملخص القرارات */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* توزيع مخاطر الامتثال المالي حسب المعيار */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            توزيع مخاطر الامتثال المالي حسب المعيار (Risk Breakdown)
          </h3>
          <div className="flex flex-col gap-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span>IAS 16 (رسملة الأصول والصيانة)</span>
                <span className="text-amber-400 font-bold">35% (متوسط)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[35%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>IAS 2 (هبوط أسعار المخزون)</span>
                <span className="text-rose-400 font-bold">45% (مرتفع)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>IFRS 16 (التزامات الإيجار)</span>
                <span className="text-emerald-400 font-bold">12% (منخفض)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[12%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>IFRS 9 (مخصصات التعثر الائتماني ECL)</span>
                <span className="text-emerald-400 font-bold">8% (منخفض)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[8%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* ملخص القرارات المعروضة على مجلس الإدارة */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            ملخص القرارات المعروضة على مجلس الإدارة
          </h3>
          <ul className="flex flex-col gap-3 text-xs text-slate-300 list-disc list-inside">
            <li>اعتماد قيود التسوية المعلقة بقيمة 71,000$ قبل إغلاق القوائم المالية.</li>
            <li>الموافقة على تكوين مخصص هبوط المخزون بقيمة 18,500$ لحماية صافي الأرباح.</li>
            <li>مراجعة صلاحيات اعتماد الفواتير لمنع تجزئة القيود واستمرار الامتثال.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}