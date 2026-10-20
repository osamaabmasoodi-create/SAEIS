import React, { useState } from 'react';

interface LeaseScheduleRow {
  year: number;
  openingLiability: number;
  interestExpense: number;
  leasePayment: number;
  closingLiability: number;
  rouDepreciation: number;
  rouCarryingAmount: number;
}

export default function LeaseEngineIFRS16() {
  // مدخلات عقد الإيجار
  const [lessorName, setLessorName] = useState<string>('مؤسسة العقارات النموذجية');
  const [annualRent, setAnnualRent] = useState<number>(50000);
  const [leaseTermYears, setLeaseTermYears] = useState<number>(5);
  const [discountRate, setDiscountRate] = useState<number>(8); // معدل الخصم الضمني %
  const [initialDirectCosts, setInitialDirectCosts] = useState<number>(2000);
  const [rooftopOperatingRent, setRooftopOperatingRent] = useState<number>(0); // رسوم إيجار التشغيل الدوري (مثلاً إيجار الأسطح)

  // حساب القيمة الحالية لالتزام الإيجار وأصل حق الاستخدام
  const calculateLease = () => {
    const r = discountRate / 100;
    let presentValue = 0;

    for (let t = 1; t <= leaseTermYears; t++) {
      presentValue += annualRent / Math.pow(1 + r, t);
    }

    const initialLiability = Number(presentValue.toFixed(2));
    const initialRouAsset = Number((initialLiability + initialDirectCosts).toFixed(2));
    const annualDepreciation = Number((initialRouAsset / leaseTermYears).toFixed(2));

    // جدول إطفاء الالتزام وإهلاك الأصل
    const schedule: LeaseScheduleRow[] = [];
    let currentLiability = initialLiability;
    let currentRou = initialRouAsset;

    for (let y = 1; y <= leaseTermYears; y++) {
      const interest = Number((currentLiability * r).toFixed(2));
      const closingLiab = Number((currentLiability + interest - annualRent).toFixed(2));
      currentRou = Number((currentRou - annualDepreciation).toFixed(2));

      schedule.push({
        year: y,
        openingLiability: currentLiability,
        interestExpense: interest,
        leasePayment: annualRent,
        closingLiability: closingLiab < 0 ? 0 : closingLiab,
        rouDepreciation: annualDepreciation,
        rouCarryingAmount: currentRou < 0 ? 0 : currentRou,
      });

      currentLiability = closingLiab;
    }

    return { initialLiability, initialRouAsset, annualDepreciation, schedule };
  };

  const { initialLiability, initialRouAsset, annualDepreciation, schedule } = calculateLease();

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المحرك */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            محرك محاكاة وحساب عقود الإيجار (IFRS 16 Lease Accounting Engine)
          </h2>
          <p className="text-xs text-slate-400">
            حساب أصول حق الاستخدام (ROU Assets)، والالتزامات الإيجارية المخصومة، وجدول الإهلاك والفوائد السنوية آلیاً.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          معيار IFRS 16 نشط
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* مدخلات العقد */}
        <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            متغيرات ومدخلات عقد الإيجار
          </h3>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">اسم المؤجر / العقد:</label>
            <input
              type="text"
              value={lessorName}
              onChange={(e) => setLessorName(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">مبلغ الدفعة الإيجارية السنوية ($):</label>
            <input
              type="number"
              value={annualRent}
              onChange={(e) => setAnnualRent(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">مدة العقد (سنوات):</label>
            <input
              type="number"
              value={leaseTermYears}
              onChange={(e) => setLeaseTermYears(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">معدل الخصم الضمني / فائدة الاقتراض (%):</label>
            <input
              type="number"
              step="0.5"
              value={discountRate}
              onChange={(e) => setDiscountRate(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400">التكاليف المباشرة الأولية المضافة للأصل ($):</label>
            <input
              type="number"
              value={initialDirectCosts}
              onChange={(e) => setInitialDirectCosts(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <blockquote className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-400 leading-relaxed">
            💡 <strong className="text-amber-400">ملاحظة معيارية:</strong> رسوم الإيجار التشغيلية الدورية (مثل رسوم إيجار الأسطح) تسجل كمصروفات تشغيلية دورية في قائمة الدخل، ولا تضاف للرأس مال المخصوم للأصل وفق IFRS 16.
          </blockquote>
        </div>

        {/* المخرجات وجدول الإهلاك والقيود */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* كروت النتائج */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
              <span className="text-[11px] text-slate-400">أصل حق الاستخدام الأول (ROU Asset)</span>
              <span className="text-base font-bold text-emerald-400 font-mono">${initialRouAsset.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
              <span className="text-[11px] text-slate-400">التزام الإيجار المخصوم الأول</span>
              <span className="text-base font-bold text-amber-400 font-mono">${initialLiability.toLocaleString()}</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
              <span className="text-[11px] text-slate-400">قسط الإهلاك السنوي للأصل</span>
              <span className="text-base font-bold text-rose-400 font-mono">${annualDepreciation.toLocaleString()}</span>
            </div>
          </div>

          {/* جدول الجدول الزمني للإطفاء */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
              جدول إطفاء الالتزام وإهلاك أصل حق الاستخدام (Amortization & Depreciation Schedule)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-900 text-slate-300">
                    <th className="p-2 text-center border border-slate-800">السنة</th>
                    <th className="p-2 text-right border border-slate-800">التزام بداية الفترة</th>
                    <th className="p-2 text-right border border-slate-800">مصروف الفائدة (8%)</th>
                    <th className="p-2 text-right border border-slate-800">الدفعة المسددة</th>
                    <th className="p-2 text-right border border-slate-800">التزام نهاية الفترة</th>
                    <th className="p-2 text-right border border-slate-800">إهلاك أصل ROU</th>
                    <th className="p-2 text-right border border-slate-800">القيم الدفترية للأصل</th>
                  </tr>
                </thead>
                <tbody className="text-slate-200 font-mono">
                  {schedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-900/50 transition">
                      <td className="p-2 border border-slate-800 text-center font-bold text-amber-400">{row.year}</td>
                      <td className="p-2 border border-slate-800">${row.openingLiability.toLocaleString()}</td>
                      <td className="p-2 border border-slate-800 text-rose-400">${row.interestExpense.toLocaleString()}</td>
                      <td className="p-2 border border-slate-800 text-emerald-400">${row.leasePayment.toLocaleString()}</td>
                      <td className="p-2 border border-slate-800 font-bold">${row.closingLiability.toLocaleString()}</td>
                      <td className="p-2 border border-slate-800 text-rose-300">${row.rouDepreciation.toLocaleString()}</td>
                      <td className="p-2 border border-slate-800 text-emerald-300">${row.rouCarryingAmount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}