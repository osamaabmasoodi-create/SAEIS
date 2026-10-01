import React, { useState } from 'react';
import { calculateIFRS9ECL, AgingSummary, ECLAuditResult } from './eclEngine';

export const Ifrs9EclViewer: React.FC = () => {
  // بيانات افتراضية لاختبار الشاشة أو ربطها مهارياً ببيانات الاستعلام
  const [data, setData] = useState<AgingSummary[]>([
    { agingBucket: 'Current', totalInvoices: 45, grossCarryingAmount: 150000, lossRate: 0.01, requiredECLProvision: 1500 },
    { agingBucket: '1-30 Days', totalInvoices: 18, grossCarryingAmount: 45000, lossRate: 0.03, requiredECLProvision: 1350 },
    { agingBucket: '31-60 Days', totalInvoices: 8, grossCarryingAmount: 20000, lossRate: 0.08, requiredECLProvision: 1600 },
    { agingBucket: '61-90 Days', totalInvoices: 5, grossCarryingAmount: 12000, lossRate: 0.15, requiredECLProvision: 1800 },
    { agingBucket: '91-180 Days', totalInvoices: 3, grossCarryingAmount: 8000, lossRate: 0.35, requiredECLProvision: 2800 },
    { agingBucket: 'Over 180 Days', totalInvoices: 2, grossCarryingAmount: 15000, lossRate: 0.75, requiredECLProvision: 11250 },
  ]);

  const auditResult: ECLAuditResult = calculateIFRS9ECL(data);

  return (
    <div className="p-6 bg-slate-900 text-slate-100 rounded-xl shadow-2xl border border-slate-800 dir-rtl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-amber-400">محرك تدقيق IFRS 9 - الخسائر الائتمانية المتوقعة (ECL)</h2>
        <span className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-xs border border-amber-500/20">
          معيار IFRS 9
        </span>
      </div>

      {/* ملخص المؤشرات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">إجمالي الذمم المدينة</p>
          <p className="text-2xl font-bold text-slate-100">{auditResult.totalReceivables.toLocaleString()} USD</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">إجمالي مخصص ECL المطلوب</p>
          <p className="text-2xl font-bold text-rose-400">{auditResult.totalRequiredProvision.toLocaleString()} USD</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">متوسط نسبة التعثر المرجحة</p>
          <p className="text-2xl font-bold text-amber-400">{(auditResult.weightedAverageLossRate * 100).toFixed(2)}%</p>
        </div>
      </div>

      {/* جدول أعمار الديون */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm text-right border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/30">
              <th className="p-3">فئة العمر (Aging Bucket)</th>
              <th className="p-3">عدد الفواتير</th>
              <th className="p-3">إجمالي الرصيد القائم</th>
              <th className="p-3">نسبة الخسارة المتوقعة</th>
              <th className="p-3">المخصص المطلوب</th>
            </tr>
          </thead>
          <tbody>
            {auditResult.summary.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                <td className="p-3 font-semibold text-slate-200">{row.agingBucket}</td>
                <td className="p-3 font-mono">{row.totalInvoices}</td>
                <td className="p-3 font-mono">{row.grossCarryingAmount.toLocaleString()}</td>
                <td className="p-3 font-mono text-amber-400">{(row.lossRate * 100).toFixed(1)}%</td>
                <td className="p-3 font-mono text-rose-400 font-semibold">{row.requiredECLProvision.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ملاحظات المراجع الآلي */}
      {auditResult.auditNotes.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-800/40 p-4 rounded-lg">
          <h4 className="text-xs font-bold text-rose-400 mb-2">ملاحظات واكتشافات المراجع الآلي:</h4>
          <ul className="list-disc list-inside text-xs text-rose-200/80 space-y-1">
            {auditResult.auditNotes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};