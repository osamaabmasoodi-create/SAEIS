import React, { useState } from 'react';

interface SqlQueryItem {
  id: string;
  title: string;
  description: string;
  query: string;
  category: string;
  executionTime: string;
  rowCount: number;
}

export default function SqlViewer() {
  const [queries] = useState<SqlQueryItem[]>([
    {
      id: 'q1',
      title: 'استعلام مطابقة القيد المزدوج وميزان المراجعة',
      description: 'يقوم بفحص تساوي إجمالي الحركات المدينة والدائنة لكل حساب لمنع الاختلال البرمجي.',
      query: `SELECT 
    account_code, 
    account_name, 
    SUM(debit) AS total_debit, 
    SUM(credit) AS total_credit, 
    (SUM(debit) - SUM(credit)) AS balance 
FROM GeneralLedger 
WHERE approved = 1 
GROUP BY account_code, account_name 
HAVING SUM(debit) <> SUM(credit);`,
      category: 'التدقيق الهيكلي',
      executionTime: '12ms',
      rowCount: 15
    },
    {
      id: 'q2',
      title: 'استعلام كشف هبوط أسعار المخزون (IAS 2 NRV)',
      description: 'يستخرج الأصناف التي تزيد تكلفتهما الدفترية عن صافي القيمة القابلة للتحقق لتحديد المخصص.',
      query: `SELECT 
    item_code, 
    item_name, 
    cost_price, 
    net_realizable_value, 
    (cost_price - net_realizable_value) AS required_provision 
FROM Inventory 
WHERE cost_price > net_realizable_value;`,
      category: 'معايير IFRS',
      executionTime: '8ms',
      rowCount: 4
    },
    {
      id: 'q3',
      title: 'استعلام كشف القيود خارج أوقات الدوام الرسمي (ML Anomaly)',
      description: 'رصد القيود المحاسبية المدخلة في العطلات الرسمية أو الأوقات المتأخرة للرقابة على والاحتيال.',
      query: `SELECT 
    entry_id, 
    user_id, 
    created_at, 
    amount, 
    description 
FROM JournalEntries 
WHERE DATEPART(dw, created_at) IN (6, 7) OR DATEPART(hour, created_at) BETWEEN 0 AND 5;`,
      category: 'كشف الاحتيال',
      executionTime: '18ms',
      rowCount: 3
    }
  ]);

  const [selectedQueryId, setSelectedQueryId] = useState<string>('q1');
  const [activeTab, setActiveTab] = useState<'results' | 'schema'>('results');

  const currentQuery = queries.find(q => q.id === selectedQueryId) || queries[0];

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl" dir="rtl">
      {/* رأس شاشة استعلامات SQL */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
            <span>مستعرض ومحرك استعلامات SQL التلقائي (T-SQL Audit Viewer)</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
              🔒 وضع القراءة الآمن (Read-Only)
            </span>
          </h2>
          <p className="text-xs text-slate-400">استعراض واستخراج استعلامات T-SQL القياسية المباشرة دون مخاطرة لتعديل الحسابات القسرية.</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
          Engine: T-SQL v15.0
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* قائمة الاستعلامات المحفوظة */}
        <div className="lg:col-span-1 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">الاستعلامات الرقابية القياسية</h3>
          {queries.map(q => (
            <div
              key={q.id}
              onClick={() => setSelectedQueryId(q.id)}
              className={`p-3 rounded-xl border transition cursor-pointer flex flex-col gap-1.5 ${
                selectedQueryId === q.id
                  ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                  {q.category}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{q.executionTime}</span>
              </div>
              <h4 className="text-xs font-extrabold text-white">{q.title}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-2">{q.description}</p>
            </div>
          ))}
        </div>

        {/* عرض كود الاستعلام والنتائج */}
        <div className="lg:col-span-2 bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white">{currentQuery.title}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{currentQuery.description}</p>
            </div>
            <button
              onClick={() => alert(`تم تنفيذ الاستعلام ${currentQuery.title} بنجاح واسترجاع ${currentQuery.rowCount} سجل.`)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow flex items-center gap-1.5"
            >
              <span>▶ تنفيذ الاستعلام الآمن</span>
            </button>
          </div>

          {/* محرر الكود بصيغة Read-Only */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
              <span>كود الاستعلام (Read-Only T-SQL):</span>
              <span className="text-amber-400">محمي من التعديل اليدوي العشوائي</span>
            </div>
            <textarea
              readOnly
              value={currentQuery.query}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-amber-300 leading-relaxed focus:outline-none cursor-not-allowed select-all"
              rows={6}
            />
          </div>

          {/* معاينة مخرجات الاستعلام */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300">نتائج الاستعلام المباشرة:</span>
              <span className="text-[11px] text-emerald-400 font-mono">عدد السجلات المطابقة: {currentQuery.rowCount} سجل</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse font-mono text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                    <th className="p-2 text-right">رقم الحساب / السجل</th>
                    <th className="p-2 text-right">اسم الحساب / البيان</th>
                    <th className="p-2 text-right">الحالة / القيمة</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="p-2 text-amber-400 font-bold">101001</td>
                    <td className="p-2">الصندوق الرئيسي - العملة المحلية</td>
                    <td className="p-2 text-emerald-400">متطابق (0.00)</td>
                  </tr>
                  <tr className="hover:bg-slate-900/50 transition">
                    <td className="p-2 text-amber-400 font-bold">102005</td>
                    <td className="p-2">مخزون البضائع الراكدة (فرع صنعاء)</td>
                    <td className="p-2 text-rose-400">يتطلب مخصص ($18,500)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}