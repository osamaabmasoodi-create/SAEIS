import React, { useState } from 'react';

export default function ExecutiveBoardDashboard() {
  // مؤشر الصحة العامة للحوكمة والامتثال (مثالي: 88%)
  const healthScore = 88;
  const totalRisksDetected = 4;
  const pendingAdjustmentsAmount = 71000;
  const netCashLiquidity = 110000;

  return (
    <div className="flex flex-col gap-6 text-right font-sans h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl" dir="rtl">
      
      {/* رأس الشاشة التنفيذية */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
            📊 لوحة القيادة التنفيذية العليا (Executive Board Dashboard)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ملخص استراتيجي عالي المستوى لمجلس الإدارة وكبار التنفيذيين لقياس سلامة الحوكمة والمخاطر دون الدخول في تفاصيل الأستاذ العام.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('تم تصدير التقرير التنفيذي لمجلس الإدارة بصيغة PDF')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
          >
            📄 تصدير تقرير المجلس
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
            بيانات ERP المباشرة
          </span>
        </div>
      </div>

      {/* الصف الأول: مؤشر سلامة الحوكمة والبطاقات الرئيسية */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        
        {/* مؤشر سلامة الحوكمة المكتمل (Compliance & Risk Health Score) */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
          <div className="absolute top-3 right-3 text-[10px] text-slate-400 font-bold">المؤشر العام</div>
          <div className="relative flex items-center justify-center my-3">
            {/* الدائرة البرمجية للمؤشر */}
            <div className="w-28 h-28 rounded-full border-8 border-emerald-500/20 border-t-emerald-400 border-r-emerald-400 flex items-center justify-center animate-in fade-in">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">{healthScore}%</span>
            </div>
          </div>
          <span className="text-xs font-bold text-white mt-1">مؤشر سلامة الحوكمة والامتثال</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full mt-1">
            مستوى أمان مرتفع
          </span>
        </div>

        {/* البطاقات الثلاث السريعة */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* إجمالي المخاطر المالية المكتشفة */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-bold">المخاطر المكتشفة</span>
              <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-bold">
                تتطلب متابعة
              </span>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-rose-400 font-mono">{totalRisksDetected}</span>
              <span className="text-xs text-slate-400 mr-2">حالات حرج/متوسط</span>
            </div>
            <p className="text-[10px] text-slate-400">تشمل تجزئة فواتير وقرارات صيانة غير مرسملة</p>
          </div>

          {/* حجم التعديلات المعلقة */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-bold">التعديلات المعلقة</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                في انتظار الترحيل
              </span>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-amber-400 font-mono">${pendingAdjustmentsAmount.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-400">قيود تسوية معايير IFRS جاهزة للتأثير على ERP</p>
          </div>

          {/* موقف السيولة صافي التدفق */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start">
              <span className="text-xs text-slate-400 font-bold">موقف السيولة المتوقع</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                موقف آمن
              </span>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">${netCashLiquidity.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-400">صافي التدفق المالي المتوقع للـ 90 يوماً القادمة</p>
          </div>

        </div>

      </div>

      {/* الصف الثاني: الرسوم البيانية التلخيصية والتوصيات التنفيذية */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* توزيع المخاطر حسب قطاعات المعايير */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 flex justify-between items-center">
            <span>توزيع مخاطر الامتثال المالي حسب المعيار (Risk Breakdown)</span>
            <span className="text-[10px] text-slate-400 font-normal">تحديث تلقائي</span>
          </h3>

          <div className="flex flex-col gap-3 my-1">
            {/* IAS 16 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">IAS 16 (رسملة الأصول والصيانة)</span>
                <span className="text-amber-400 font-mono">متوسط (35%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            {/* IAS 2 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">IAS 2 (هبوط أسعار المخزون)</span>
                <span className="text-rose-400 font-mono">مرتفع (45%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            {/* IFRS 16 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">IFRS 16 (التزامات الإيجار)</span>
                <span className="text-emerald-400 font-mono">منخفض (12%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>

            {/* IFRS 9 */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-bold">IFRS 9 (مخصصات التعثر الائتماني ECL)</span>
                <span className="text-blue-400 font-mono">منخفض (8%)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* التوصيات الاستراتيجية الصادرة للـ CEO / المجلس */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-3 justify-between">
          <div>
            <h3 className="text-xs font-bold text-amber-400 border-b border-slate-800 pb-2 mb-3">
              💡 ملخص القرارات الموصى بها لمجلس الإدارة
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5 leading-relaxed list-disc list-inside">
              <li>اعتماد قيود التسوية المعلقة بقيمة <b className="text-white">$71,000</b> قبل إغلاق القوائم المالية الحالية.</li>
              <li>الموافقة على تكوين مخصص هبوط المخزون بقيمة <b className="text-rose-400">$18,500</b> لحماية صافي الأرباح.</li>
              <li>مراجعة صلاحيات اعتماد الفواتير لمنع تجزئة القيود واستمرار الامتثال.</li>
            </ul>
          </div>

          <button 
            onClick={() => alert('تم توجيه التوصيات إلى الإدارة المالية للبدء بالتنفيذ')}
            className="w-full bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold py-2.5 rounded-xl text-xs transition shadow"
          >
            اعتماد التوصيات وتحويلها للتنفيذ
          </button>
        </div>

      </div>

    </div>
  );
}