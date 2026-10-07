import React from 'react';
import { useApp } from './AppContext'; // الاستيراد من نفس المجلد

export default function CorrectionEngineView() {
  const { activeFileName, totalRowsAnalyzed, complianceScore, violationsCount } = useApp();

  return (
    <div className="bg-slate-950 p-6 rounded-xl text-white space-y-4">
      <h3 className="text-sm font-bold text-amber-400">محرك التصحيح التلقائي للقيود</h3>
      <p className="text-xs text-slate-400">
        يتم تحليل الملف النشط حالياً: <span className="text-emerald-400 font-bold">{activeFileName}</span> 
        بإجمالي صفوف مجهزة: <span className="text-cyan-400 font-bold">{totalRowsAnalyzed}</span>
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400">الامتثال الحالي</span>
          <div className="text-sm font-bold text-emerald-400 mt-1">{complianceScore}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <span className="text-[10px] text-slate-400">عدد القيود</span>
          <div className="text-sm font-bold text-rose-400 mt-1">{violationsCount}</div>
        </div>
      </div>
    </div>
  );
}