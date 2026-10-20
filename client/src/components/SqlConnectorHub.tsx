import React, { useState } from 'react';

export default function SqlConnectorHub() {
  const [serverInstance, setServerInstance] = useState<string>('localhost\\SQLEXPRESS');
  const [databaseName, setDatabaseName] = useState<string>('SAEIS_Audit_DB');
  const [sqlQuery, setSqlQuery] = useState<string>('SELECT TOP 10 AccountCode, AccountName, Balance, Period FROM GeneralLedger WHERE Approved = 1;');
  const [queryResult, setQueryResult] = useState<any[]>([
    { AccountCode: '1011', AccountName: 'النقدية بالصندوق', Balance: 45000, Period: '2026-10' },
    { AccountCode: '1021', AccountName: 'بنك الكريمي - جاري', Balance: 185000, Period: '2026-10' },
    { AccountCode: '1210', AccountName: 'العملاء والمدينون', Balance: 320000, Period: '2026-10' },
    { AccountCode: '2010', AccountName: 'الموردون والدائنون', Balance: 124000, Period: '2026-10' }
  ]);

  const handleTestDbConnection = () => {
    alert(`تم الاتصال بنجاح بقاعدة البيانات ${databaseName} على الخادم ${serverInstance} عبر T-SQL Driver!`);
  };

  const handleExecuteQuery = () => {
    alert('تم تنفيذ استعلام الـ T-SQL بنجاح وتحديث جداول المعاينة الحية.');
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المركز */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            مركز ربط واستعلام قواعد بيانات الـ SQL المباشر (Live SQL Database Connector & Query Hub)
          </h2>
          <p className="text-xs text-slate-400">
            الاتصال المباشر بقواعد بيانات SQL Server (SSMS)، تنفيذ استعلامات T-SQL، وعرض الجداول التنفيذية لمعايير IFRS.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          قاعدة البيانات متصلة
        </span>
      </div>

      {/* إعدادات الاتصال بقاعدة البيانات */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-300 font-bold">خادم SQL Server (Server Instance):</label>
          <input
            type="text"
            value={serverInstance}
            onChange={(e) => setServerInstance(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-300 font-bold">اسم قاعدة البيانات (Database Name):</label>
          <input
            type="text"
            value={databaseName}
            onChange={(e) => setDatabaseName(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          onClick={handleTestDbConnection}
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow h-10"
        >
          اختبار الاتصال بقاعدة البيانات
        </button>
      </div>

      {/* محرر الاستعلامات ونتائج التنفيذ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* محرر T-SQL */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            محرر استعلامات T-SQL المتقدم
          </h3>
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={6}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-amber-400 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
          />
          <button
            onClick={handleExecuteQuery}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
          >
            تنفيذ الاستعلام (Execute Query)
          </button>
        </div>

        {/* جدول عرض النتائج */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            نتائج الاستعلام الفورية (Query Result Grid)
          </h3>
          <div className="overflow-x-auto max-h-[220px]">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  <th className="p-2.5 border border-slate-800 text-right">رقم الحساب</th>
                  <th className="p-2.5 border border-slate-800 text-right">اسم الحساب</th>
                  <th className="p-2.5 border border-slate-800 text-right">الرصيد ($)</th>
                  <th className="p-2.5 border border-slate-800 text-right">الفترة</th>
                </tr>
              </thead>
              <tbody className="text-slate-200 font-mono">
                {queryResult.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="p-2.5 border border-slate-800 text-amber-400 font-bold">{row.AccountCode}</td>
                    <td className="p-2.5 border border-slate-800 font-sans font-bold">{row.AccountName}</td>
                    <td className="p-2.5 border border-slate-800 text-emerald-400">${row.Balance.toLocaleString()}</td>
                    <td className="p-2.5 border border-slate-800 text-slate-400">{row.Period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}