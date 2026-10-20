import React, { useState } from 'react';

interface RiskIndicator {
  id: number;
  ruleName: string;
  category: string;
  riskScore: 'مرتفع جداً' | 'مرتفع' | 'متوسط';
  detectedCount: number;
  financialImpact: number;
  status: 'قيد المراقبة' | 'تم المعالجة';
}

export default function FraudRiskMatrixHub() {
  const [stressRate, setStressRate] = useState<number>(20); // نسبة الصدمة الافتراضية تراجع الإيرادات
  const [indicators, setIndicators] = useState<RiskIndicator[]>([
    {
      id: 1,
      ruleName: 'تجزئة الفواتير لتفادي حدود الاعتماد',
      category: 'التلاعب بالقيود',
      riskScore: 'مرتفع جداً',
      detectedCount: 4,
      financialImpact: 19600,
      status: 'قيد المراقبة'
    },
    {
      id: 2,
      ruleName: 'ترحيل قيود خارج أوقات الدوام الرسمي (أيام العطل)',
      category: 'صلاحيات المستخدمين',
      riskScore: 'مرتفع',
      detectedCount: 2,
      financialImpact: 37000,
      status: 'قيد المراقبة'
    },
    {
      id: 3,
      ruleName: 'تكرار قيود المصروفات لنفس المورد خلال 24 ساعة',
      category: 'تكرار المدفوعات',
      riskScore: 'متوسط',
      detectedCount: 5,
      financialImpact: 12500,
      status: 'تم المعالجة'
    }
  ]);

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المحرك */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            محرك تقييم المخاطر واختبارات التحمل لتدقيق الاحتيال (Advanced Fraud Risk & Stress Testing)
          </h2>
          <p className="text-xs text-slate-400">
            تحليل سلوك قيود اليومية، رصد مؤشرات الشذوذ، واختبار ملاءة الشركة ضد صدمات السوق الافتراضية.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          محرك التعلم الآلي نشط
        </span>
      </div>

      {/* قسم اختبارات التحمل (Stress Testing) */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200">
            اختبارات التحمل والصدمات المالية (Financial Stress Testing Sandbox)
          </h3>
          <span className="text-xs font-mono text-amber-400">
            نسبة صدمة تراجع الإيرادات: {stressRate}%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-300">حدد نسبة التراجع الفرضية في الإيرادات (%):</label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={stressRate}
              onChange={(e) => setStressRate(Number(e.target.value))}
              className="accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">التأثير المتوقع على صافي الربح</span>
            <span className="text-base font-bold text-rose-400">
              -${(1500000 * (stressRate / 100)).toLocaleString()}
            </span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-1">تقييم الملاءة بعد الصدمة</span>
            <span className="text-xs font-bold text-emerald-400">
              {stressRate > 30 ? 'تحت المراقبة المشددة (Warning)' : 'مستقر وآمن (Safe)'}
            </span>
          </div>
        </div>
      </div>

      {/* جدول مؤشرات مخاطر الاحتيال */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          سجل الأنماط المشبوهة ومؤشرات مخاطر الاحتيال المرصودة
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold">
                <th className="p-3 border border-slate-800 text-right">قاعدة الرصد والمخاطر</th>
                <th className="p-3 border border-slate-800 text-center">التصنيف</th>
                <th className="p-3 border border-slate-800 text-center">مستوى الخطورة</th>
                <th className="p-3 border border-slate-800 text-center">عدد مرات الرصد</th>
                <th className="p-3 border border-slate-800 text-left">الأثر المالي الإجمالي</th>
                <th className="p-3 border border-slate-800 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="text-slate-200 font-mono">
              {indicators.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 border border-slate-800 font-sans font-bold text-white">{item.ruleName}</td>
                  <td className="p-3 border border-slate-800 text-center font-sans text-slate-300">{item.category}</td>
                  <td className="p-3 border border-slate-800 text-center font-sans">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      item.riskScore === 'مرتفع جداً' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {item.riskScore}
                    </span>
                  </td>
                  <td className="p-3 border border-slate-800 text-center text-amber-400 font-bold">{item.detectedCount}</td>
                  <td className="p-3 border border-slate-800 text-left text-rose-400 font-bold">${item.financialImpact.toLocaleString()}</td>
                  <td className="p-3 border border-slate-800 text-center font-sans">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800">
                      {item.status}
                    </span>
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