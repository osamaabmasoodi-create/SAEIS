import React, { useState } from 'react';

interface SqlviewerProps {
  auditData?: any[];
}

const initialMockData = [
  { account_code: '101001', account_name: 'النقدية بالصندوق', debit: 5000, credit: 0 },
  { account_code: '102001', account_name: 'العملاء (ذمم مدينة)', debit: 12000, credit: 0 }
];

export default function SqlViewer({ auditData = [] }: SqlviewerProps) {
  const [query, setQuery] = useState('SELECT account_code, account_name, debit, credit FROM accounts;');
  const [results, setResults] = useState<any[]>(auditData.length > 0 ? auditData : initialMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        if (auditData.length > 0) {
          setResults(auditData);
        } else {
          setResults(initialMockData);
        }
        setLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تنفيذ الاستعلام');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 text-slate-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">SQL Viewer - SAEIS</h2>
      <div className="mb-4">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-24 p-3 bg-slate-800 text-emerald-400 font-mono rounded border border-slate-700 focus:outline-none focus:border-emerald-500"
          placeholder="أدخل استعلام SQL هنا..."
        />
        <button
          onClick={handleExecute}
          disabled={loading}
          className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded transition"
        >
          {loading ? 'جاري التنفيذ...' : 'تشغيل الاستعلام'}
        </button>
      </div>

      {error && <div className="p-3 mb-4 bg-red-900 text-red-200 rounded">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-800 border-b border-slate-700">
              <th className="p-2">رمز الحساب</th>
              <th className="p-2">اسم الحساب</th>
              <th className="p-2">مدين</th>
              <th className="p-2">دائن</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="p-2 font-mono">{row.account_code}</td>
                <td className="p-2">{row.account_name}</td>
                <td className="p-2">{row.debit}</td>
                <td className="p-2">{row.credit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}