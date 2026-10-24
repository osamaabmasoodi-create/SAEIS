import React, { useState } from 'react';

interface EclBucket {
  stage: 'Stage 1' | 'Stage 2' | 'Stage 3';
  stageLabel: string;
  agingDays: string;
  totalExposure: number;
  pdRate: number;
  lgdRate: number;
  requiredProvision: number;
  riskColor: string;
}

interface Ifrs9EclEngineProps {
  onCreateAdjustment?: () => void;
}

export default function Ifrs9EclEngine({ onCreateAdjustment }: Ifrs9EclEngineProps) {
  const [buckets] = useState<EclBucket[]>([
    {
      stage: 'Stage 1',
      stageLabel: 'مخاطر ائتمانية منخفضة (ديون منتظمة)',
      agingDays: '0 - 30 يوم',
      totalExposure: 1250000,
      pdRate: 1.5,
      lgdRate: 45,
      requiredProvision: 8437.5,
      riskColor: 'emerald'
    },
    {
      stage: 'Stage 2',
      stageLabel: 'زيادة جوهرية في المخاطر (تأخير متوسط)',
      agingDays: '31 - 90 يوم',
      totalExposure: 320000,
      pdRate: 8.0,
      lgdRate: 50,
      requiredProvision: 12800,
      riskColor: 'amber'
    },
    {
      stage: 'Stage 3',
      stageLabel: 'أصول متعثرة / هبوط ائتماني (ديون معدومة)',
      agingDays: '+90 يوم',
      totalExposure: 85000,
      pdRate: 65.0,
      lgdRate: 75,
      requiredProvision: 41437.5,
      riskColor: 'rose'
    }
  ]);

  const totalExposureSum = buckets.reduce((acc, b) => acc + b.totalExposure, 0);
  const totalProvisionSum = buckets.reduce((acc, b) => acc + b.requiredProvision, 0);
  const recordedProvision = 45000;
  const provisionShortfall = totalProvisionSum - recordedProvision;

  return (
    <div className="flex flex-col gap-6 text-right font-sans h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl" dir="rtl">
      
      {/* رأس الشاشة */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
            📊 محرك الخسائر الائتمانية المتوقعة (IFRS 9 Expected Credit Loss Engine)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تصنيف محفظة المدينين والعملاء عبر المراحل الثلاث (Stage 1-3) واحتساب مخصص الهبوط المطلوب آلياً بموجب المعيار الدولي IFRS 9.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (onCreateAdjustment) {
                onCreateAdjustment();
              } else {
                alert(`تم توليد قيد تسوية بمبلغ $${provisionShortfall.toLocaleString()} لحساب مخصص الديون المشكوك فيها.`);
              }
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
          >
            ⚙️ إنشاء قيد تسوية المخصص ($17,675)
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
            مطابق لـ IFRS 9
          </span>
        </div>
      </div>

      {/* بطاقات الملخص */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold">إجمالي رصيد العملاء (Exposure)</span>
          <span className="text-xl font-extrabold text-white font-mono my-2">${totalExposureSum.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400">مستخرج من الأستاذ المساعد</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold">المخصص المطلوب (IFRS 9 ECL)</span>
          <span className="text-xl font-extrabold text-amber-400 font-mono my-2">${totalProvisionSum.toLocaleString()}</span>
          <span className="text-[10px] text-amber-400">حساب آلي وفقاً لمعدلات التعثر</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold">المخصص المسجل بالدفاتر</span>
          <span className="text-xl font-extrabold text-slate-300 font-mono my-2">${recordedProvision.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400">حساب مخصص الديون الحالي</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-bold">عجز المخصص (تأثير أرباح وخسائر)</span>
          <span className="text-xl font-extrabold text-rose-400 font-mono my-2">${provisionShortfall.toLocaleString()}</span>
          <span className="text-[10px] text-rose-400">يتطلب قيد تسوية إضافي</span>
        </div>
      </div>

      {/* جدول تقسيم المراحل Stage 1 to 3 */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-3">
          تصنيف المحفظة الائتمانية ومعدلات التعثر والتخلف عن السداد
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 text-[11px]">
                <th className="p-3 text-right border border-slate-800">المرحلة والمعيار (Stage)</th>
                <th className="p-3 text-right border border-slate-800">فترة الاستحقاق / الأيام</th>
                <th className="p-3 text-right border border-slate-800">إجمالي التعرض المالي ($)</th>
                <th className="p-3 text-center border border-slate-800">احتمالية التعثر (PD)</th>
                <th className="p-3 text-center border border-slate-800">خسارة التعثر (LGD)</th>
                <th className="p-3 text-right border border-slate-800">المخصص المحسوب ($)</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-200">
              {buckets.map((b, idx) => (
                <tr key={idx} className="hover:bg-slate-950/50 transition">
                  <td className="p-3 border border-slate-800 font-bold flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.riskColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      b.riskColor === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {b.stage}
                    </span>
                    <span className="text-slate-300 text-[11px]">{b.stageLabel}</span>
                  </td>
                  <td className="p-3 border border-slate-800 font-mono text-slate-400">{b.agingDays}</td>
                  <td className="p-3 border border-slate-800 font-mono text-white font-bold">${b.totalExposure.toLocaleString()}</td>
                  <td className="p-3 border border-slate-800 font-mono text-center text-amber-400">{b.pdRate}%</td>
                  <td className="p-3 border border-slate-800 font-mono text-center text-slate-400">{b.lgdRate}%</td>
                  <td className="p-3 border border-slate-800 font-mono text-emerald-400 font-bold">${b.requiredProvision.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}