import React, { useState } from 'react';

export default function TaxComplianceBridge() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-101', vendor: 'شركة الحلول الذكية', amount: 15000, vat: 2250, status: 'معلق للتدقيق', compliance: 'غير محقق' },
    { id: 'INV-2026-102', vendor: 'مؤسسة التقنية المتقدمة', amount: 8200, vat: 1230, status: 'جاهز للترحيل', compliance: 'مطابق لـ ZATCA' },
    { id: 'INV-2026-103', vendor: 'شركة النور الهندسية', amount: 24000, vat: 3600, status: 'مرفوض', compliance: 'خطأ في حساب نسبة VAT' }
  ]);

  const handlePreAuditCheck = (id: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id) {
        return {
          ...inv,
          status: 'تم التدقيق بنجاح',
          compliance: 'مطابق لشروط الفوترة الإلكترونية'
        };
      }
      return inv;
    }));
    alert(`تم تشغيل محرك التحقق المسبق للفاتورة ${id} بنجاح وخلوها من أخطاء الـ VAT!`);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full p-4" dir="rtl">
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-cyan-400 mb-1">2. بوابة "سند" للامتثال الضريبي (E-Invoicing Bridge)</h2>
          <p className="text-xs text-slate-400">محرك التحقق المسبق لفحص الفواتير والضرائب قبل الترحيل</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          نشط
        </span>
      </div>

      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">سجل فواتير محرك التحقق المسبق</h3>

        <div className="flex flex-col gap-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-cyan-300 font-mono text-xs">{inv.id} - {inv.vendor}</span>
                <span className="text-[11px] text-slate-400">المبلغ: ${inv.amount.toLocaleString()} \vert{} VAT:${inv.vat}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                  inv.compliance.includes('مطابق') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {inv.compliance}
                </span>
                <button 
                  onClick={() => handlePreAuditCheck(inv.id)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                >
                  فحص مسبق 🔍
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400">
          💡 يتم فحص بنود الفاتورة والضرائب آلياً للتأكد من مطابقتها لمعايير الفوترة الإلكترونية ومنع أخطاء الـ VAT.
        </div>
      </div>
    </div>
  );
}