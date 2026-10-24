import React, { useState } from 'react';

interface RatioMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  benchmark: number;
  status: 'آمن' | 'تحذير' | 'حرج';
  category: 'سيولة' | 'نشاط' | 'ملائة';
  description: string;
}

export default function LiquiditySolvencyRatiosEngine() {
  const [ratios, setRatios] = useState<RatioMetric[]>([
    {
      id: 'current_ratio',
      name: 'نسبة التداول (Current Ratio)',
      value: 1.85,
      unit: 'مرة',
      benchmark: 2.0,
      status: 'آمن',
      category: 'سيولة',
      description: 'تقيس قدرة الشركة على تغطية التزاماتها قصيرة الأجل باستخدام أصولها المتداولة.'
    },
    {
      id: 'quick_ratio',
      name: 'النسبة السريعة (Quick Ratio)',
      value: 0.85,
      unit: 'مرة',
      benchmark: 1.0,
      status: 'تحذير',
      category: 'سيولة',
      description: 'تقيس السيولة الفورية باستبعاد المخزون الأكثر صعوبة في التسييل السريع.'
    },
    {
      id: 'working_capital',
      name: 'رأس المال العامل (Working Capital)',
      value: 350000,
      unit: '$',
      benchmark: 250000,
      status: 'آمن',
      category: 'سيولة',
      description: 'المازاد من الأصول المتداولة بعد سداد كافة الالتزامات قصيرة الأجل.'
    },
    {
      id: 'inventory_turnover',
      name: 'معدل دوران المخزون (Inventory Turnover)',
      value: 3.2,
      unit: 'مرات/سنة',
      benchmark: 5.0,
      status: 'حرج',
      category: 'نشاط',
      description: 'مؤشر كفاءة إدارة المخزون وسرعة تصريحه وتحويله لمبيعات.'
    },
    {
      id: 'receivables_turnover',
      name: 'معدل دوران العملاء (Receivables Turnover)',
      value: 4.8,
      unit: 'مرات/سنة',
      benchmark: 6.0,
      status: 'تحذير',
      category: 'نشاط',
      description: 'يقيس كفاءة تحصيل الديون والائتمان الممنوح للعملاء.'
    }
  ]);

  return (
    <div className="flex flex-col gap-6 text-right font-sans h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl" dir="rtl">
      
      {/* رأس الشاشة */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
            📈 تحليل النسب المالية والسيولة النسبية (Automated Solvency & Liquidity Ratios Analyzer)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            قياس وتحليل المؤشرات المالية الحرجة تلقائياً من بيانات الـ ERP وإطلاق تنبيهات عند انخفاض أية نسبة عن المعيار المقبول.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('جاري تحديث الحسابات وإعادة الاحتساب المباشر من قاعدة بيانات الـ ERP...')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
          >
            🔄 إعادة احتساب النسب
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
            محتسب تلقائياً من الـ ERP
          </span>
        </div>
      </div>

      {/* تنبيه حرج ذكي في حالة وجود مؤشرات سلبية */}
      <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <h4 className="text-xs font-bold text-rose-400">تنبيه انحراف عن معيار القطاع المقبول</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              تم رصد انخفاض في <b>معدل دوران المخزون (3.2)</b> و <b>النسبة السريعة (0.85)</b> عن المستهدف المحدد لقطاع الشركة.
            </p>
          </div>
        </div>
        <button 
          onClick={() => alert('تم إرسال توصية لمدير المخازن والائتمان لتسريع التحصيل والتصريف.')}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow transition"
        >
          إرسال توصية معالجة
        </button>
      </div>

      {/* كروت المؤشرات والنسب */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ratios.map((ratio) => (
          <div key={ratio.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between gap-3">
            <div className="flex justify-between items-start border-b border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-white">{ratio.name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                ratio.status === 'آمن' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                ratio.status === 'تحذير' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {ratio.status}
              </span>
            </div>

            <div className="flex justify-between items-baseline my-1">
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                {ratio.unit === '$' ? `$${ratio.value.toLocaleString()}` : `${ratio.value} ${ratio.unit}`}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                المعيار: {ratio.unit === '$' ? `$${ratio.benchmark.toLocaleString()}` : ratio.benchmark}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800">
              {ratio.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}