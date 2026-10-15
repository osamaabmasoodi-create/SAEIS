// @ts-nocheck
import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Database, Play, CheckCircle2, Download, Terminal, Search, Clock } from 'lucide-react';

export const SqlViewer: React.FC = () => {
  const context = useApp() as any;
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM vu_AdjustedTrialBalance WHERE variance_flag = 1");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const sampleRows = [
    { code: "101001", name: "النقدية بالبنك - الحساب الجاري", debit: 250000.00, credit: 0.00, status: "نعم", statusClass: "text-emerald-400 bg-emerald-500/10" },
    { code: "102001", name: "عملاء ومدينون (إحلال مدينة)", debit: 185000.00, credit: 0.00, status: "نعم (ECL)", statusClass: "text-amber-400 bg-amber-500/10" },
    { code: "103001", name: "المخزون السلعي (Inventory - IAS 2)", debit: 410000.00, credit: 0.00, status: "معدل (NRV)", statusClass: "text-blue-400 bg-blue-500/10" },
    { code: "104001", name: "أصول حق الاستخدام (IFRS 16 - ROU Assets)", debit: 5164023.00, credit: 0.00, status: "نعم", statusClass: "text-emerald-400 bg-emerald-500/10" },
    { code: "105001", name: "الأصول الثابتة (IAS 16 - PPE)", debit: 1291006.00, credit: 0.00, status: "معدل", statusClass: "text-purple-400 bg-purple-500/10" },
  ];

  const filteredRows = sampleRows.filter(row => 
    row.code.includes(searchTerm) || row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExecute = () => {
    setIsExecuting(true);
    setExecuted(false);
    setTimeout(() => {
      setIsExecuting(false);
      setExecuted(true);
    }, 500);
  };

  const loadSnippet = (query: string) => {
    setSqlQuery(query);
  };

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* الهيدر الرئيسي */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-lg flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-amber-500" />
            <span>محرك الاستعلامات وقواعد البيانات (T-SQL / SQL Command)</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            الاتصال المباشر بقاعدة بيانات ميزان المراجعة لملف ({context?.fileName || "SAEIS_Master_Audit_Demo_3000.xlsx"})
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Response: 0.028s</span>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SAEIS SQL Engine Active</span>
          </div>
        </div>
      </div>

      {/* محرر الأوامر */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 space-y-4 shadow">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>محرر الأوامر والتعليقات المعيارية</span>
          </span>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400">استعلامات سريعة:</span>
            <button 
              onClick={() => loadSnippet("SELECT * FROM vu_AdjustedTrialBalance WHERE variance_flag = 1")}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 transition-all"
            >
              فحص الفروقات
            </button>
            <button 
              onClick={() => loadSnippet("SELECT * FROM tbl_IFRS9_ECL_Summary WHERE stage >= 2")}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded border border-slate-700 transition-all"
            >
              عملاء المرحلة 2 و 3
            </button>
          </div>
        </div>

        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          rows={3}
          className="w-full bg-slate-950 text-emerald-400 font-mono text-sm p-4 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 transition-all"
          dir="ltr"
        ></textarea>

        <div className="flex justify-between items-center pt-2 flex-wrap gap-3">
          {executed ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              تم التنفيذ بنجاح: تم استرجاع 3,000 سجل.
            </span>
          ) : (
            <span className="text-xs text-slate-400">اضغط لتنفيذ الاستعلام الفوري على قاعدة بيانات العميل</span>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("تم تصدير نتائج الاستعلام بنجاح إلى ملف Excel!")}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all border border-slate-700"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>تصدير النتائج</span>
            </button>

            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-amber-600/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isExecuting ? 'جاري التنفيذ...' : 'تشغيل الاستعلام (Execute T-SQL)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* جدول النتائج مع شريط البحث الحي */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200 text-sm">نتائج التنفيذ (Data Grid View)</span>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              3,000 حساب متاح
            </span>
          </div>

          {/* حقل تصفية النتائج */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              placeholder="بحث برقم أو اسم الحساب..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 text-xs text-white pr-9 pl-4 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="p-4">رقم الحساب</th>
                <th className="p-4">اسم الحساب</th>
                <th className="p-4">مدين</th>
                <th className="p-4">دائن</th>
                <th className="p-4 text-center">حالة التعديل (IS_ADJUSTED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors font-mono">
                  <td className="p-4 text-amber-400 font-bold">{row.code}</td>
                  <td className="p-4 font-sans font-medium text-white">{row.name}</td>
                  <td className="p-4 text-emerald-400">${row.debit.toLocaleString()}</td>
                  <td className="p-4 text-slate-400">${row.credit.toLocaleString()}</td>
                  <td className="p-4 text-center font-sans">
                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${row.statusClass}`}>
                      {row.status}
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
};

export default SqlViewer;