import React, { useState } from 'react';

interface InvoiceAnomaly {
  id: number;
  supplierName: string;
  invoiceNo: string;
  amount: number;
  riskType: 'فواتير مزدوجة ومتطابقة' | 'فواتير متقاربة بقيم مشبوهة' | 'مشتريات تفتقر لمستند مؤيد (Ghost)';
  date: string;
  status: 'معلق' | 'تم الحظر' | 'مؤكد وصحيح';
}

export default function DuplicateGhostInvoicesEngine() {
  const [invoices, setInvoices] = useState<InvoiceAnomaly[]>([
    {
      id: 1,
      supplierName: 'مؤسسة الهدى للتجارة والتوريدات',
      invoiceNo: 'INV-88412',
      amount: 14500,
      riskType: 'فواتير مزدوجة ومتطابقة',
      date: '2026-10-20',
      status: 'معلق'
    },
    {
      id: 2,
      supplierName: 'شركة النور للأجهزة المكتبية',
      invoiceNo: 'INV-9021',
      amount: 7200,
      riskType: 'مشتريات تفتقر لمستند مؤيد (Ghost)',
      date: '2026-10-18',
      status: 'معلق'
    },
    {
      id: 3,
      supplierName: 'مجموعة الأفق الحديث',
      invoiceNo: 'INV-4410A',
      amount: 14450,
      riskType: 'فواتير متقاربة بقيم مشبوهة',
      date: '2026-10-15',
      status: 'معلق'
    }
  ]);

  const handleAction = (id: number, newStatus: 'تم الحظر' | 'مؤكد وصحيح') => {
    setInvoices(prev =>
      prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
    );
    alert(`تم تحديث حالة الفحص المالي إلى: (${newStatus}) بنجاح.`);
  };

  return (
    <div className="flex flex-col gap-6 text-right font-sans h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl" dir="rtl">
      
      {/* رأس الشاشة */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
            🛡️ محرك كشف الفواتير المزدوجة والمشتريات الوهمية (Duplicate & Ghost Invoices AI Engine)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            فحص ذكي لدفاتر الموردين (Accounts Payable) لرصد التكرار، تقارب القيم، وانعدام المستندات المؤيدة لتفادي الاحتيال.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('جاري تشغيل الفحص العشوائي لجميع دفاتر الموردين عبر خوارزميات AI...')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
          >
            🔍 بدء الفحص العميق للدفاتر
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
            محرك AP الذكي نشط
          </span>
        </div>
      </div>

      {/* مؤشرات ملخصة سريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
          <span className="text-xs text-slate-400 font-bold">إجمالي الفواتير المفحوصة</span>
          <span className="text-2xl font-extrabold text-white font-mono my-2">1,420</span>
          <span className="text-[10px] text-emerald-400">من قاعدة بيانات الـ ERP</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
          <span className="text-xs text-slate-400 font-bold">شبهات مزدوجة / وهمية مكتشفة</span>
          <span className="text-2xl font-extrabold text-rose-400 font-mono my-2">3 حالات</span>
          <span className="text-[10px] text-rose-400">تتطلب قراراً فورياً للصرف أو الحظر</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
          <span className="text-xs text-slate-400 font-bold">إجمالي المبالغ تحت الاشتباه</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono my-2">$36,150</span>
          <span className="text-[10px] text-amber-400">محمية من الصرف المزدوج</span>
        </div>
      </div>

      {/* جدول حالات الشبهات والفواتير المكتشفة */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          سجل حالات الفواتير المزدوجة والمشتريات المعلقة
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 text-[11px]">
                <th className="p-3 text-right border border-slate-800">اسم المورد</th>
                <th className="p-3 text-right border border-slate-800">رقم الفاتورة</th>
                <th className="p-3 text-right border border-slate-800">المبلغ ($)</th>
                <th className="p-3 text-right border border-slate-800">نوع الشبهة / المخاطرة</th>
                <th className="p-3 text-right border border-slate-800">تاريخ الإدخال</th>
                <th className="p-3 text-center border border-slate-800">الإجراء الرقابي الموصى به</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-200">
              {invoices.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/50 transition">
                  <td className="p-3 border border-slate-800 font-bold text-white">{item.supplierName}</td>
                  <td className="p-3 border border-slate-800 font-mono text-amber-400">{item.invoiceNo}</td>
                  <td className="p-3 border border-slate-800 font-mono text-emerald-400">${item.amount.toLocaleString()}</td>
                  <td className="p-3 border border-slate-800">
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                      {item.riskType}
                    </span>
                  </td>
                  <td className="p-3 border border-slate-800 font-mono text-slate-400">{item.date}</td>
                  <td className="p-3 border border-slate-800 text-center">
                    {item.status === 'معلق' ? (
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleAction(item.id, 'تم الحظر')}
                          className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow transition"
                        >
                          حظر الصرف
                        </button>
                        <button 
                          onClick={() => handleAction(item.id, 'مؤكد وصحيح')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow transition"
                        >
                          اعتماد الصرف
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                        item.status === 'تم الحظر' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}