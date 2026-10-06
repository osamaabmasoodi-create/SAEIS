import React, { useState } from 'react';
import { ShieldCheck, Calculator, AlertTriangle, CheckCircle, RefreshCw, Layers, FileText, ArrowRightLeft } from 'lucide-react';

export default function AutomatedCreditScoringEngineV2() {
  const [portfolio, setPortfolio] = useState([
    { id: 'CUST-101', name: 'شركة الأفق للتجارة', ead: 120000, pd: 0.02, lgd: 0.40, stage: 1 },
    { id: 'CUST-102', name: 'مؤسسة النور الحديثة', ead: 85000, pd: 0.12, lgd: 0.50, stage: 2 },
    { id: 'CUST-103', name: 'شركة الرافدين للتقنية', ead: 210000, pd: 0.85, lgd: 0.75, stage: 3 },
    { id: 'CUST-104', name: 'مكتب السعيد للاستشارات', ead: 45000, pd: 0.01, lgd: 0.30, stage: 1 },
  ]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [journalGenerated, setJournalGenerated] = useState(false);

  // حساب إجمالي الـ ECL للمحفظة
  const totalECL = portfolio.reduce((acc, curr) => {
    const ecl = curr.stage === 3 ? curr.ead * curr.lgd : curr.ead * curr.pd * curr.lgd;
    return acc + ecl;
  }, 0);

  const calculateECL = (ead: number, pd: number, lgd: number, stage: number) => {
    if (stage === 3) return ead * lgd; 
    return ead * pd * lgd;
  };

  const handleRunModel = () => {
    setIsCalculating(true);
    setJournalGenerated(false);
    setTimeout(() => {
      setIsCalculating(false);
    }, 500);
  };

  const handleGenerateJournalEntry = () => {
    setJournalGenerated(true);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6" dir="rtl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">محرك التقييم الائتماني ونموذج ECL المتكامل (وفقاً لمعيار IFRS 9)</h3>
            <p className="text-xs text-slate-400">حساب الخسائر الائتمانية المتوقعة وتوليد قيود التسوية المحاسبية الآلية.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunModel}
            disabled={isCalculating}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow"
          >
            <RefreshCw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            تحديث النماذج
          </button>
          <button
            onClick={handleGenerateJournalEntry}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-900/20"
          >
            <ArrowRightLeft className="w-4 h-4" />
            توليد قيد التسوية المحاسبي الآلي
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">محفظة الذمم المدينة الإجمالية</span>
          <h4 className="text-lg font-black text-white mt-1">
            ${portfolio.reduce((acc, curr) => acc + curr.ead, 0).toLocaleString()}
          </h4>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">إجمالي مخصص ECL المحسوب</span>
          <h4 className="text-lg font-black text-amber-400 mt-1">
            ${totalECL.toLocaleString(undefined, {maximumFractionDigits: 2})}
          </h4>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">حالة الترحيل المحاسبي</span>
          <h4 className="text-lg font-black text-cyan-400 mt-1">
            {journalGenerated ? 'تم الترحيل لدفتر اليومية' : 'بانتظار الاعتماد والتوليد'}
          </h4>
        </div>
      </div>

      {journalGenerated && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle className="w-5 h-5" />
            <span>تم توليد قيد التسوية المحاسبي الآلي بنجاح وترحيله إلى قاعدة البيانات (Batch #ECL-2026-10):</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-300 space-y-1.5 border border-slate-800">
            <div className="text-amber-400 font-bold">من ح/ مصروف الخسائر الائتمانية (Expected Credit Loss Expense) — ${totalECL.toLocaleString(undefined, {maximumFractionDigits: 2})} (مدين)</div>
            <div className="text-emerald-400 font-bold pr-6">إلى ح/ مخصص خسائر الذمم المدينة (Allowance for ECL) — ${totalECL.toLocaleString(undefined, {maximumFractionDigits: 2})} (دائن)</div>
            <div className="text-slate-500 text-[10px] pt-1 border-t border-slate-900">ملاحظة القيد: إثبات مخصص الخسائر الائتمانية المتوقعة للذمم المدينة طبقاً لمتطلبات المعيار الدولي IFRS 9.</div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th className="p-3">معرف العميل</th>
              <th className="p-3">اسم العميل</th>
              <th className="p-3">التعرض عند التعثر (EAD)</th>
              <th className="p-3">احتمالية التعثر (PD)</th>
              <th className="p-3">الخسارة عند التعثر (LGD)</th>
              <th className="p-3">مرحلة المخاطر (Stage)</th>
              <th className="p-3">مخصص ECL المحسوب</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {portfolio.map((item) => {
              const eclValue = calculateECL(item.ead, item.pd, item.lgd, item.stage);
              return (
                <tr key={item.id} className="hover:bg-slate-800/30">
                  <td className="p-3 font-mono text-emerald-400 font-bold">{item.id}</td>
                  <td className="p-3 font-bold text-slate-200">{item.name}</td>
                  <td className="p-3 font-mono text-slate-300">${item.ead.toLocaleString()}</td>
                  <td className="p-3 font-mono text-slate-300">{(item.pd * 100).toFixed(1)}%</td>
                  <td className="p-3 font-mono text-slate-300">{(item.lgd * 100).toFixed(0)}%</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      item.stage === 1 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      item.stage === 2 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      المرحلة {item.stage}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-amber-400 font-bold">${eclValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}