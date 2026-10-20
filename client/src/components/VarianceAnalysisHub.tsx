import React, { useState } from 'react';

interface VarianceItem {
  id: number;
  accountName: string;
  category: string;
  previousPeriod: number;
  currentPeriod: number;
  varianceAmount: number;
  variancePercent: number;
  significance: 'جوهرى ومهم' | 'عادي';
}

export default function VarianceAnalysisHub() {
  const [items] = useState<VarianceItem[]>([
    {
      id: 1,
      accountName: 'إيرادات المبيعات الرئيسية',
      category: 'الإيرادات',
      previousPeriod: 1200000,
      currentPeriod: 1500000,
      varianceAmount: 300000,
      variancePercent: 25.0,
      significance: 'جوهرى ومهم'
    },
    {
      id: 2,
      accountName: 'تكلفة البضاعة المباعة',
      category: 'التكاليف المباشرة',
      previousPeriod: 700000,
      currentPeriod: 850000,
      varianceAmount: 150000,
      variancePercent: 21.4,
      significance: 'جوهرى ومهم'
    },
    {
      id: 3,
      accountName: 'مصروفات الإيجار التشغيلي',
      category: 'المصروفات التشغيلية',
      previousPeriod: 120000,
      currentPeriod: 125000,
      varianceAmount: 5000,
      variancePercent: 4.1,
      significance: 'عادي'
    },
    {
      id: 4,
      accountName: 'مصروفات الصيانة والإصلاح',
      category: 'المصروفات العمومية',
      previousPeriod: 45000,
      currentPeriod: 72000,
      varianceAmount: 27000,
      variancePercent: 60.0,
      significance: 'جوهرى ومهم'
    }
  ]);

  const significantCount = items.filter(i => i.significance === 'جوهرى ومهم').length;

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس اللوحة */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            لوحة تحليل التباين والمقارنة المالية بين الفترات (Period-over-Period Variance Hub)
          </h2>
          <p className="text-xs text-slate-400">
            رصد الانحرافات النسبية والنقدية وتحديد البنود الجوهرية المتوافقة مع متطلبات الإفصاح المعياري IFRS 18.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          التحليل المالي نشط
        </span>
      </div>

      {/* جدول تحليل التباين */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200">
            جدول الانحرافات والتحليلات المقارنة للحسابات والبنود المالية
          </h3>
          <span className="text-xs font-mono text-emerald-400">
            عدد البنود المفحوصة: {items.length} بنود رئيسية
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold">
                <th className="p-3 border border-slate-800 text-right">اسم الحساب أو البند</th>
                <th className="p-3 border border-slate-800 text-center">التصنيف</th>
                <th className="p-3 border border-slate-800 text-left">الفترة السابقة</th>
                <th className="p-3 border border-slate-800 text-left">الفترة الحالية</th>
                <th className="p-3 border border-slate-800 text-left">قيمة التباين</th>
                <th className="p-3 border border-slate-800 text-center">نسبة التباين (%)</th>
                <th className="p-3 border border-slate-800 text-center">الأهمية والجوهرية</th>
              </tr>
            </thead>
            <tbody className="text-slate-200 font-mono">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 border border-slate-800 font-sans font-bold text-white">{item.accountName}</td>
                  <td className="p-3 border border-slate-800 text-center font-sans text-slate-300">{item.category}</td>
                  <td className="p-3 border border-slate-800 text-left text-slate-300">${item.previousPeriod.toLocaleString()}</td>
                  <td className="p-3 border border-slate-800 text-left text-white font-bold">${item.currentPeriod.toLocaleString()}</td>
                  <td className={`p-3 border border-slate-800 text-left font-bold ${
                    item.varianceAmount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {item.varianceAmount >= 0 ? `+${item.varianceAmount.toLocaleString()}` : item.varianceAmount.toLocaleString()}
                  </td>
                  <td className={`p-3 border border-slate-800 text-center font-bold ${
                    item.variancePercent >= 20 ? 'text-amber-400' : 'text-slate-300'
                  }`}>
                    {item.variancePercent}%
                  </td>
                  <td className="p-3 border border-slate-800 text-center font-sans">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      item.significance === 'جوهرى ومهم' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {item.significance}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* قسم التقرير التفسيري الذكي التلقائي */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-amber-400">
            التقرير التفسيري الذكي للانحرافات الجوهرية (Executive Variance Commentary)
          </h3>
          <span className="text-[11px] text-slate-400">
            تم رصد <b className="text-amber-400">{significantCount}</b> انحرافات تتطلب إفصاحاً معيارياً
          </span>
        </div>

        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 text-xs leading-relaxed text-slate-300">
          <p>
            • <strong className="text-emerald-400">ارتفاع الإيرادات الرئيسية بنسبة 25%:</strong> يرجع هذا النمو إلى زيادة المبيعات في الفترة الحالية بمبلغ 300,000$، مما ينعكس إيجاباً على الأداء التشغيلي.
          </p>
          <p>
            • <strong className="text-amber-400">ارتفاع تكلفة البضاعة المباعة بنسبة 21.4%:</strong> الزيادة متناسبة طردياً مع ارتفاع الإيرادات، مما يشير إلى ثبات هامش الربح الإجمالي تقريباً.
          </p>
          <p>
            • <strong className="text-rose-400">ارتفاع غير عادي في مصروفات الصيانة والإصلاح (60%):</strong> يتطلب هذا البند مراجعة مستندية من التدقيق الداخلي للتأكد من عدم وجود مصاريف رأسمالية مدرجة خطأ كمصروفات تشغيلية وفق معيار IAS 16.
          </p>
        </div>
      </div>
    </div>
  );
}