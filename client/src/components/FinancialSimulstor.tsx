import React, { useState } from 'react';

export default function FinancialSimulator() {
  const [discountRate, setDiscountRate] = useState(10);
  const [zakatRate, setZakatRate] = useState(2.5);
  const [inventoryProvision, setInventoryProvision] = useState(185004);

  const baseRevenue = 1250000;
  const adjustedNetProfit = baseRevenue - inventoryProvision;
  const calculatedZakat = (adjustedNetProfit * (zakatRate / 100)).toFixed(2);
  const netAfterZakat = (adjustedNetProfit - Number(calculatedZakat)).toFixed(2);

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">مُحاكي السيناريوهات المالية والزكوية (Stress & Compliance Simulator)</h2>
          <p className="text-xs text-slate-400">اختبار تأثير متغيرات المعايير والنسب على صافي الربح والوعاء الزكوي لحظياً</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          ● وضع المحاكاة النشطة
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">متغيرات المحاكاة</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">مخصص هبوط المخزون (IAS 2) ($):</label>
            <input 
              type="number" 
              value={inventoryProvision} 
              onChange={(e) => setInventoryProvision(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">نسبة الزكاة / الضريبة الافتراضية (%):</label>
            <input 
              type="number" 
              step="0.1"
              value={zakatRate} 
              onChange={(e) => setZakatRate(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">معدل الخصم لنموذج القيمة الحالية (IFRS 16) (%):</label>
            <input 
              type="number" 
              value={discountRate} 
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">النتائج المالية بعد المحاكاة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">صافي الربح المعدل بعد المخصصات</span>
                <span className="text-lg font-bold text-amber-400">${Number(adjustedNetProfit).toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">الوعاء الزكوي / الضريبي المقدر</span>
                <span className="text-lg font-bold text-rose-400">${Number(calculatedZakat).toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">صافي الربح النهائي بعد الزكاة</span>
                <span className="text-lg font-bold text-emerald-400">${Number(netAfterZakat).toLocaleString()}</span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">معدل العائد على الأصول (ROA - محاكى)</span>
                <span className="text-lg font-bold text-blue-400">+14.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}