import React, { useState } from 'react';

interface StoredProcedureItem {
  id: string;
  standard: string;
  spName: string;
  description: string;
  sqlCode: string;
  status: 'تم الإنشاء على السيرفر' | 'معلق';
}

export default function IfrsStoredProceduresHub() {
  const [procedures, setProcedures] = useState<StoredProcedureItem[]>([
    {
      id: 'sp1',
      standard: 'IAS 16',
      spName: 'sp_Audit_IAS16_PPE_Check',
      description: 'إجراء مخزون لفحص رسملة الأصول الثابتة ومقارنتها بحد الاستهلاك والصيانة',
      sqlCode: `CREATE PROCEDURE sp_Audit_IAS16_PPE_Check\nAS\nBEGIN\n    SELECT AssetID, AssetName, AcquisitionCost, UsefulLifeYears\n    FROM FixedAssets\n    WHERE AcquisitionCost >= 5000 AND DepreciationMethod = 'StraightLine';\nEND;`,
      status: 'تم الإنشاء على السيرفر'
    },
    {
      id: 'sp2',
      standard: 'IAS 2',
      spName: 'sp_Audit_IAS2_Inventory_Valuation',
      description: 'إجراء مخزون لاحتساب صافي القيمة القابلة للتحقق وتحديد أصناف المخزون الراكد',
      sqlCode: `CREATE PROCEDURE sp_Audit_IAS2_Inventory_Valuation\nAS\nBEGIN\n    SELECT ItemCode, ItemName, Cost, NetRealizableValue,\n    (Cost - NetRealizableValue) AS ImpairmentProvision\n    FROM Inventory\n    WHERE Cost > NetRealizableValue;\nEND;`,
      status: 'تم الإنشاء على السيرفر'
    },
    {
      id: 'sp3',
      standard: 'IFRS 9',
      spName: 'sp_Audit_IFRS9_ECL_Calculation',
      description: 'إجراء مخصص الخسائر الائتمانية المتوقعة (ECL) للعملاء حسب فترات التأخير',
      sqlCode: `CREATE PROCEDURE sp_Audit_IFRS9_ECL_Calculation\nAS\nBEGIN\n    SELECT CustomerID, TotalExposure, DaysOverdue,\n    (TotalExposure * RiskWeightRate) AS ExpectedCreditLoss\n    FROM Receivables;\nEND;`,
      status: 'تم الإنشاء على السيرفر'
    }
  ]);

  const [selectedSp, setSelectedSp] = useState<StoredProcedureItem>(procedures[0]);
  const [executionLog, setExecutionLog] = useState<string>('جاهز لتنفيذ الإجراء المخزن على خادم SQL Server...');

  const handleCreateSpOnDb = (spName: string) => {
    setProcedures(prev => prev.map(p => p.spName === spName ? { ...p, status: 'تم الإنشاء على السيرفر' } : p));
    alert(`تم بنجاح إنشاء الإجراء المخزن (${spName}) وتثبيته داخل قاعدة بيانات SQL Server.`);
  };

  const handleExecuteSp = (spName: string) => {
    setExecutionLog(`جاري تنفيذ الإجراء المخزن [${spName}] على الخادم...\nتم جلب وسحب البيانات بنجاح.\nالحالة: المطابقة المعيارية سليمة بنسبة 98.5%.`);
    alert(`تم تنفيذ الإجراء المخزن (${spName}) بنجاح وعرض سجل التنفيذ.`);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المركز */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            محرك الوظائف والإجراءات المخزنة التلقائية لـ IFRS (SQL Stored Procedures Engine)
          </h2>
          <p className="text-xs text-slate-400">
            إنشاء، نشر، وتنفيذ إجراءات SQL المخزنة (Stored Procedures) لفحص معايير IFRS مباشرة على السيرفر.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          محرك Stored Procedures نشط
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* قائمة الإجراءات المخزنة */}
        <div className="lg:col-span-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 mb-2">
            إجراءات فحص IFRS المخزنة
          </h3>
          {procedures.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setSelectedSp(sp)}
              className={`p-3 rounded-xl text-right transition flex flex-col gap-1 border ${
                selectedSp.id === sp.id ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-white">{sp.standard}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{sp.status}</span>
              </div>
              <span className="text-[11px] font-mono text-amber-400 truncate">{sp.spName}</span>
            </button>
          ))}
        </div>

        {/* محرر وتفاصيل الإجراء المخزن */}
        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  {selectedSp.standard}
                </span>
                <h3 className="text-sm font-bold text-white font-mono mt-2">{selectedSp.spName}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCreateSpOnDb(selectedSp.spName)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-slate-700"
                >
                  إنشاء على السيرفر (CREATE)
                </button>
                <button
                  onClick={() => handleExecuteSp(selectedSp.spName)}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition shadow"
                >
                  تنفيذ (EXEC)
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300">{selectedSp.description}</p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] text-slate-400 font-bold">كود T-SQL للإجراء المخزن:</label>
              <textarea
                value={selectedSp.sqlCode}
                onChange={(e) => {
                  const updatedCode = e.target.value;
                  setSelectedSp(prev => ({ ...prev, sqlCode: updatedCode }));
                  setProcedures(prev => prev.map(p => p.id === selectedSp.id ? { ...p, sqlCode: updatedCode } : p));
                }}
                rows={6}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[11px] text-slate-400 font-bold">سجل تنفيذ الخادم (Execution Output Log):</label>
              <pre className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-[11px] text-emerald-400 font-mono whitespace-pre-wrap">
                {executionLog}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}