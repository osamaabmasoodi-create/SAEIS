import React, { useState } from 'react';

interface MonthlyTrend {
  month: string;
  currentRatio: number;
  netMargin: number;
  debtToEquity: number;
}

export default function KpiChartsHub() {
  const [trendData] = useState<MonthlyTrend[]>([
    { month: 'يوليو', currentRatio: 1.85, netMargin: 14.2, debtToEquity: 0.95 },
    { month: 'أغسطس', currentRatio: 1.92, netMargin: 16.0, debtToEquity: 0.90 },
    { month: 'سبتمبر', currentRatio: 2.05, netMargin: 17.5, debtToEquity: 0.88 },
    { month: 'أكتوبر', currentRatio: 2.15, netMargin: 18.4, debtToEquity: 0.85 },
  ]);

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس التقرير البياني */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            مخططات تحليل اتجاهات النسب المالية (Financial Ratio Trends Analytics)
          </h2>
          <p className="text-xs text-slate-400">
            تتبع حركة السيولة والربحية والمديونية عبر الأشهر لمراقبة الاستقرار المالي.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          تحليل الاتجاهات نشط
        </span>
      </div>

      {/* جدول وسجل الاتجاهات الشهرية */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          مقارنة اتجاهات المؤشرات المالية عبر الأشهر
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold">
                <th className="p-3 border border-slate-800 text-right">الفترة الشهرية</th>
                <th className="p-3 border border-slate-800 text-center">نسبة التداول (Current Ratio)</th>
                <th className="p-3 border border-slate-800 text-center">هامش صافي الربح (Net Margin %)</th>
                <th className="p-3 border border-slate-800 text-center">الديون إلى حقوق الملكية (D/E)</th>
                <th className="p-3 border border-slate-800 text-center">مؤشر الاتجاه</th>
              </tr>
            </thead>
            <tbody className="text-slate-200 font-mono">
              {trendData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 border border-slate-800 font-sans font-bold text-white">{row.month} 2026</td>
                  <td className="p-3 border border-slate-800 text-center text-amber-400 font-bold">{row.currentRatio}</td>
                  <td className="p-3 border border-slate-800 text-center text-emerald-400 font-bold">{row.netMargin}%</td>
                  <td className="p-3 border border-slate-800 text-center text-blue-400 font-bold">{row.debtToEquity}</td>
                  <td className="p-3 border border-slate-800 text-center font-sans">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ↑ تحسن مستمر
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}