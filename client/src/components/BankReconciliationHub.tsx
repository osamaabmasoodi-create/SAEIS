import React, { useState } from 'react';

interface BankTransaction {
  id: string;
  transDate: string;
  referenceNo: string;
  description: string;
  amount: number;
  type: 'مدين (إيداع)' | 'دائن (سحب)';
  matchStatus: 'مطابق آلياً' | 'معلق / غير مطابق';
}

export default function BankReconciliationHub() {
  const [bankStatementName, setBankStatementName] = useState<string>('Bank_Statement_Oct2026.xlsx');
  const [matchingToleranceDays, setMatchingToleranceDays] = useState<number>(2);

  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([
    {
      id: 'TXN-8801',
      transDate: '2026-10-15',
      referenceNo: 'REF-99401',
      description: 'تحصيل دفعة عميل - شركة الأفق',
      amount: 15000,
      type: 'مدين (إيداع)',
      matchStatus: 'مطابق آلياً'
    },
    {
      id: 'TXN-8802',
      transDate: '2026-10-17',
      referenceNo: 'REF-99405',
      description: 'عمولات وسداد مصاريف بنكية',
      amount: 250,
      type: 'دائن (سحب)',
      matchStatus: 'معلق / غير مطابق'
    },
    {
      id: 'TXN-8803',
      transDate: '2026-10-18',
      referenceNo: 'REF-99410',
      description: 'تحصيل حوالة صادرة - المورد الدولي',
      amount: 45000,
      type: 'مدين (إيداع)',
      matchStatus: 'مطابق آلياً'
    }
  ]);

  const handleRunAutoReconciliation = () => {
    alert('تم تشغيل خوارزمية المطابقة الآلية بنجاح مع سجلات دفتر النقدية في الـ ERP.');
  };

  const handleGenerateAdjustmentEntry = (txnId: string, description: string, amount: number) => {
    alert(`تم توليد قيد تسوية بنكية تلقائي للحركة (${txnId}) بمبلغ $${amount.toLocaleString()} للبيان: ${description}`);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المركز */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            محرك المطابقة والتسوية البنكية الآلية (Automated Bank Reconciliation Engine)
          </h2>
          <p className="text-xs text-slate-400">
            مطابقة كشوفات الحسابات البنكية مع دفاتر الـ ERP ورصد الفروقات وتوليد قيود التسوية.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          محرك التسوية نشط
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* لوحة التحكم والإعدادات */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            إعدادات كشف البنك والمطابقة
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-bold">ملف كشف البنك المرفوع:</label>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-amber-400 font-mono truncate">
              {bankStatementName}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-bold">حد السماح بالفارق التجاري (أيام):</label>
            <input
              type="number"
              value={matchingToleranceDays}
              onChange={(e) => setMatchingToleranceDays(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <button
            onClick={handleRunAutoReconciliation}
            className="mt-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
          >
            <span>تشغيل المطابقة الذكية الآلية</span>
          </button>
        </div>

        {/* جدول المعاملات والمطابقة */}
        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            نتائج مطابقة كشف البنك مع دفتر النقدية
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  <th className="p-2.5 border border-slate-800 text-right">التاريخ</th>
                  <th className="p-2.5 border border-slate-800 text-right">المرجع</th>
                  <th className="p-2.5 border border-slate-800 text-right">البيان</th>
                  <th className="p-2.5 border border-slate-800 text-right">المبلغ</th>
                  <th className="p-2.5 border border-slate-800 text-center">حالة المطابقة</th>
                  <th className="p-2.5 border border-slate-800 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="text-slate-200 font-mono">
                {bankTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-2.5 border border-slate-800 text-slate-400">{txn.transDate}</td>
                    <td className="p-2.5 border border-slate-800 text-amber-400 font-bold">{txn.referenceNo}</td>
                    <td className="p-2.5 border border-slate-800 font-sans">{txn.description}</td>
                    <td className="p-2.5 border border-slate-800 text-emerald-400">${txn.amount.toLocaleString()}</td>
                    <td className="p-2.5 border border-slate-800 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        txn.matchStatus === 'مطابق آلياً'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {txn.matchStatus}
                      </span>
                    </td>
                    <td className="p-2.5 border border-slate-800 text-center font-sans">
                      {txn.matchStatus === 'معلق / غير مطابق' ? (
                        <button
                          onClick={() => handleGenerateAdjustmentEntry(txn.id, txn.description, txn.amount)}
                          className="bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition shadow"
                        >
                          توليد قيد تسوية
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[10px]">لا يتطلب إجراء</span>
                      )}
                    </td>
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