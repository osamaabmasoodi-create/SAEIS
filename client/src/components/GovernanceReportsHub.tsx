import React, { useState } from 'react';

interface ReportItem {
  id: string;
  title: string;
  category: string;
  date: string;
  status: 'جاهز للتصدير' | 'قيد الفحص';
  description: string;
}

export default function GovernanceReportsHub() {
  const [reports] = useState<ReportItem[]>([
    {
      id: 'REP-001',
      title: 'تقرير الامتثال الشامل لمعايير التقارير المالية الدولية (IFRS)',
      category: 'الحوكمة والامتثال',
      date: 'أكتوبر 2026',
      status: 'جاهز للتصدير',
      description: 'ملخص شامل لنتائج الفحص الآلي للقيود وإثبات المعالجات طبقاً لـ IFRS & IAS.'
    },
    {
      id: 'REP-002',
      title: 'الإقرار الزكوي والضريبي المعتمد (Tax & Zakat Audit)',
      category: 'الضرائب والزكاة',
      date: 'أكتوبر 2026',
      status: 'جاهز للتصدير',
      description: 'احتساب الوعاء الزكوي والضريبي وفحص القيود المستثناة بناءً على الأنظمة المعتمدة.'
    },
    {
      id: 'REP-003',
      title: 'سجل المخاطر واكتشاف الأحداث المشبوهة (Fraud & Anomaly Log)',
      category: 'الرقابة الداخلية',
      date: 'أكتوبر 2026',
      status: 'جاهز للتصدير',
      description: 'توثيق العمليات الخارقة لصلاحيات الاعتماد وتجزئة الفواتير التي تم رصدها عبر ML.'
    }
  ]);

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المركز */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            مركز تقارير الحوكمة والرقابة المالية (Financial Governance & Compliance Reports)
          </h2>
          <p className="text-xs text-slate-400">
            توليد وتصدير التقارير الرسمية للإدارة العليا والمراجعين الخارجيين والجهات الرقابية.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          التقارير جاهزة
        </span>
      </div>

      {/* قائمة التقارير */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reports.map((report) => (
          <div key={report.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-amber-400 border border-slate-800 font-bold">
                  {report.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{report.date}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-200 mt-1">{report.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {report.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => alert(`جاري تصدير ${report.title} بنجاح...`)}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-xl text-xs transition shadow"
              >
                تصدير التقرير (PDF / Excel)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}