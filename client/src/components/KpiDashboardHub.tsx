import React, { useState } from 'react';

interface KpiMetric {
  id: string;
  name: string;
  category: 'السيولة' | 'الربحية' | 'المديونية' | 'الامتثال المعياري';
  value: string;
  target: string;
  status: 'ممتاز' | 'مقبول' | 'تحذير';
  description: string;
}

export default function KpiDashboardHub() {
  const [kpiList] = useState<KpiMetric[]>([
    {
      id: 'kpi-1',
      name: 'نسبة التداول الجارية (Current Ratio)',
      category: 'السيولة',
      value: '2.15',
      target: '≥ 1.50',
      status: 'ممتاز',
      description: 'قدرة الأصول المتداولة على تغطية الالتزامات قصيرة الأجل.'
    },
    {
      id: 'kpi-2',
      name: 'هامش صافي الربح (Net Margin)',
      category: 'الربحية',
      value: '18.4%',
      target: '≥ 15.0%',
      status: 'ممتاز',
      description: 'نسبة أرباح الشركة المحققة مقارنة بإجمالي الإيرادات.'
    },
    {
      id: 'kpi-3',
      name: 'نسبة الديون إلى حقوق الملكية (Debt-to-Equity)',
      category: 'المديونية',
      value: '0.85',
      target: '≤ 1.20',
      status: 'ممتاز',
      description: 'مدى الاعتماد على التمويل الخارجي والديون مقارنة بحقوق الملكية.'
    },
    {
      id: 'kpi-4',
      name: 'مؤشر الامتثال لـ IFRS & IAS',
      category: 'الامتثال المعياري',
      value: '98.5%',
      target: '≥ 95.0%',
      status: 'ممتاز',
      description: 'مطابقة المعالجات المحاسبية في الـ ERP لقواعد المعايير الدولية.'
    }
  ]);

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المركز */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            لوحة مؤشرات الأداء والقياس المالي (Financial KPIs & Ratio Analytics Hub)
          </h2>
          <p className="text-xs text-slate-400">
            تحليل آلي للنسب المالية، ومؤشرات السيولة، والربحية، والامتثال المعياري لحظياً.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          المؤشرات نشطة
        </span>
      </div>

      {/* بطاقات المؤشرات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiList.map((kpi) => (
          <div key={kpi.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800 font-bold">
                  {kpi.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {kpi.status}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-200 mt-2">{kpi.name}</h3>
            </div>

            <div className="flex justify-between items-baseline border-t border-b border-slate-800 py-3 my-1">
              <span className="text-2xl font-bold font-mono text-amber-400">{kpi.value}</span>
              <span className="text-[11px] text-slate-400">الهدف: <b className="text-slate-200 font-mono">{kpi.target}</b></span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              {kpi.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}