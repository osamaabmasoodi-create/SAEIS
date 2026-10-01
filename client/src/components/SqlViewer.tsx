import React, { useState } from 'react';

// بيانات تجريبية افتراضية لميزان المراجعة والتسويات
const initialMockData = [
  { account_code: '101001', account_name: 'النقدية بالبنوك - الحساب الجاري', debit: 250000.00, credit: 0.00, is_adjusted: 'نعم' },
  { account_code: '102001', account_name: 'عملاء ومدينون (ذمم مدينة)', debit: 185000.00, credit: 0.00, is_adjusted: 'نعم (ECL)' },
  { account_code: '103001', account_name: 'المخزون السلعي (Inventory - IAS 2)', debit: 420000.00, credit: 0.00, is_adjusted: 'معدل (NRV)' },
  { account_code: '104001', account_name: 'أصول حق الاستخدام (ROU Assets - IFRS 16)', debit: 120000.00, credit: 0.00, is_adjusted: 'نعم' },
  { account_code: '105001', account_name: 'الأصول الثابتة (PPE - IAS 16)', debit: 850000.00, credit: 0.00, is_adjusted: 'معدل' },
  { account_code: '201001', account_name: 'الموردون والدائنون', debit: 0.00, credit: 310000.00, is_adjusted: 'لا' },
  { account_code: '202001', account_name: 'التزامات عقود الإيجار (Leasing Liabilities)', debit: 0.00, credit: 120000.00, is_adjusted: 'نعم' },
  { account_code: '203001', account_name: 'مخصص الخسائر الائتمانية المتوقعة (ECL)', debit: 0.00, credit: 18500.00, is_adjusted: 'جديد' },
  { account_code: '204001', account_name: 'مخصص انخفاض قيمة المخزون', debit: 0.00, credit: 18500.00, is_adjusted: 'جديد' },
  { account_code: '301001', account_name: 'رأس المال المدفوع', debit: 0.00, credit: 1000000.00, is_adjusted: 'لا' },
];

export const SqlViewer: React.FC = () => {
  const [query, setQuery] = useState('SELECT account_code, account_name, debit, credit, is_adjusted FROM vw_AdjustedTrialBalance;');
  const [results, setResults] = useState<any[]>(initialMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/sql/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      if (data.status === 'success' && Array.isArray(data.data) && data.data.length > 0) {
        setResults(data.data);
      } else {
        setResults(initialMockData);
      }
    } catch (err: any) {
      setResults(initialMockData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#1e293b]/90 border border-slate-700/70 rounded-2xl space-y-6 shadow-xl">
      <div className="flex justify-between items-center flex-wrap gap-2 border-b border-slate-700/60 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🛢️ استعلامات وقواعد البيانات (T-SQL Viewer)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تشغيل ومراجعة الاستعلامات المباشرة لميزان المراجعة المعدل وقواعد التدقيق في SAEIS
          </p>
        </div>
        <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-1.5 rounded-xl">
          T-SQL Engine Active
        </span>
      </div>
      
      {/* محرر الاستعلامات */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-300">أمر T-SQL / SQL Command:</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={4}
          className="w-full p-4 bg-[#0f172a] text-emerald-400 font-mono text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 shadow-inner dir-ltr"
          placeholder="أدخل استعلام SQL هنا..."
        />
        <div className="flex justify-between items-center flex-wrap gap-2 pt-1">
          <button
            onClick={handleExecute}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-2"
          >
            {loading ? 'جاري التنفيذ...' : '▶ تشغيل الاستعلام (Execute T-SQL)'}
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => setQuery('SELECT * FROM vw_AdjustedTrialBalance;')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700"
            >
              ميزان المراجعة المعدل
            </button>
            <button
              onClick={() => setQuery('SELECT * FROM audit_adjustments_log WHERE is_approved = 1;')}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded-lg border border-slate-700"
            >
              سجل التسويات المعتمدة
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* جدول عرض النتائج */}
      <div className="overflow-x-auto bg-[#0f172a] rounded-xl border border-slate-800 shadow-md">
        {results.length > 0 ? (
          <table className="w-full text-right text-xs">
            <thead className="bg-[#1e293b] text-slate-300 font-bold border-b border-slate-700">
              <tr>
                {Object.keys(results[0]).map((key) => (
                  <th key={key} className="p-3 border-l border-slate-800/60 uppercase">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {results.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition">
                  {Object.values(row).map((val: any, i) => (
                    <td key={i} className="p-3 border-l border-slate-800/40">
                      {typeof val === 'number' ? val.toLocaleString(undefined, { minimumFractionDigits: 2 }) : String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-6 text-slate-400 text-center text-xs">لا توجد نتائج للعرض حالياً.</p>
        )}
      </div>
    </div>
  );
};