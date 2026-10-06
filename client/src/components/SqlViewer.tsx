import React, { useState } from 'react';

export default function SqlViewer() {
  const [activeSubTab, setActiveSubTab] = useState('trial-balance');
  const [sqlCommand, setSqlCommand] = useState('SELECT account_code, account_name, debit, credit, is_adjusted FROM vw_AdjustedTrialBalance');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);

  // دالة محاكاة تنفيذ استعلام T-SQL الفعلي
  const handleExecuteSql = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    setExecutionResult(null);

    setTimeout(() => {
      setIsExecuting(false);
      setExecutionResult('تم تنفيذ الاستعلام بنجاح. تم استرجاع 100,002 سجل مع مطابقة معايير IFRS.');
    }, 600);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans" dir="rtl">
      
      {/* شريط الأوامر وتنفيد الاستعلام T-SQL */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-md">
        <label className="block text-xs font-bold text-amber-400 mb-2">
          أمر T-SQL / SQL Command
        </label>
        <form onSubmit={handleExecuteSql} className="flex flex-col gap-3">
          <textarea
            value={sqlCommand}
            onChange={(e) => setSqlCommand(e.target.value)}
            rows={2}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-amber-500"
          />
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-400">T-SQL Engine Active - متصل بقاعدة بيانات SAEIS</span>
            <button
              type="submit"
              disabled={isExecuting}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-2 rounded-xl text-xs transition shadow flex items-center gap-2"
            >
              {isExecuting ? 'جاري التنفيذ...' : 'تشغيل الاستعلام (Execute T-SQL)'}
            </button>
          </div>
        </form>

        {/* رسالة نجاح التنفيذ */}
        {executionResult && (
          <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-2.5 rounded-lg text-xs">
            {executionResult}
          </div>
        )}
      </div>

      {/* شريط التبويبات الفرعية: ميزان المراجعة المعدل + سجل التسويات المعتمدة */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('trial-balance')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'trial-balance'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          ميزان المراجعة المعدل
        </button>
        <button
          onClick={() => setActiveSubTab('adjustments-log')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeSubTab === 'adjustments-log'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          سجل التسويات المعتمدة
        </button>
      </div>

      {/* محتوى التبويب الأول: ميزان المراجعة المعدل */}
      {activeSubTab === 'trial-balance' && (
        <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 text-right">
                <th className="p-3.5">رقم الحساب</th>
                <th className="p-3.5">اسم الحساب</th>
                <th className="p-3.5">مدين</th>
                <th className="p-3.5">دائن</th>
                <th className="p-3.5">حالة التعديل (IS_ADJUSTED)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-right">
              <tr className="hover:bg-slate-900/50">
                <td className="p-3.5 text-slate-400 font-mono">101001</td>
                <td className="p-3.5 text-slate-200">النقدية بالبنوك - الحساب الجاري</td>
                <td className="p-3.5 text-emerald-400 font-mono">250,000.00</td>
                <td className="p-3.5 text-slate-400 font-mono">0.00</td>
                <td className="p-3.5"><span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-bold">نعم</span></td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3.5 text-slate-400 font-mono">102001</td>
                <td className="p-3.5 text-slate-200">عملاء ومدينون (ذمم مدينة)</td>
                <td className="p-3.5 text-emerald-400 font-mono">185,000.00</td>
                <td className="p-3.5 text-slate-400 font-mono">0.00</td>
                <td className="p-3.5"><span className="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded text-[10px] font-bold">نعم (ECL)</span></td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3.5 text-slate-400 font-mono">103001</td>
                <td className="p-3.5 text-slate-200">المخزون السلعي (Inventory - IAS 2)</td>
                <td className="p-3.5 text-emerald-400 font-mono">420,000.00</td>
                <td className="p-3.5 text-slate-400 font-mono">0.00</td>
                <td className="p-3.5"><span className="bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded text-[10px] font-bold">معدل (NRV)</span></td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3.5 text-slate-400 font-mono">104001</td>
                <td className="p-3.5 text-slate-200">أصول حق الاستخدام (16 IFRS - ROU Assets)</td>
                <td className="p-3.5 text-emerald-400 font-mono">120,000.00</td>
                <td className="p-3.5 text-slate-400 font-mono">0.00</td>
                <td className="p-3.5"><span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-bold">نعم</span></td>
              </tr>
              <tr className="hover:bg-slate-900/50">
                <td className="p-3.5 text-slate-400 font-mono">105001</td>
                <td className="p-3.5 text-slate-200">الأصول الثابتة (16 IAS - PPE)</td>
                <td className="p-3.5 text-emerald-400 font-mono">850,000.00</td>
                <td className="p-3.5 text-slate-400 font-mono">0.00</td>
                <td className="p-3.5"><span className="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded text-[10px] font-bold">معدل</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* محتوى التبويب الثاني: سجل التسويات المعتمدة */}
      {activeSubTab === 'adjustments-log' && (
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-amber-400 mb-1">سجل القيود والتسويات المحاسبية المعتمدة (Audit Adjustments)</h3>
            <p className="text-xs text-slate-400">مسار التدقيق الكامل لكافة القيود المعدلة وفقاً لمتطلبات معايير المحاسبة الدولية (IAS / IFRS):</p>
          </div>
          
          <div className="space-y-3">
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-100">تسوية هبوط قيمة المخزون (IAS 2)</span>
                <p className="text-[11px] text-slate-400 mt-1">من ح/ خسارة هبوط المخزون إلى ح/ مخصص هبوط قيمة المخزون</p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-bold">معتمد ومرحل للـ ERP</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-100">تسوية الخسائر الائتمانية المتوقعة (IFRS 9)</span>
                <p className="text-[11px] text-slate-400 mt-1">من ح/ مصروف الخسائر الائتمانية إلى ح/ مخصص خسائر الائتمان المتوقعة</p>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-bold">معتمد ومرحل للـ ERP</span>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-100">إعادة تصنيف مصاريف الصيانة (IAS 16)</span>
                <p className="text-[11px] text-slate-400 mt-1">من ح/ الأصول الثابتة إلى ح/ مصروفات التشغيل والصيانة الدورية</p>
              </div>
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-bold">قيد مراجعة نهائية</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}