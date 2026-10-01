import React, { useState } from 'react';
import { ShieldCheck, Calculator, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export const Ifrs9EclViewer: React.FC = () => {
  const [calculating, setCalculating] = useState(false);
  const [auditResult, setAuditResult] = useState({
    totalExposure: 1250000,
    stage1Ecl: 12500,
    stage2Ecl: 45000,
    stage3Ecl: 80000,
    totalProvision: 137500,
    coverageRatio: 11.0,
    auditNotes: [
      'تم التحقق من انتقال العملاء للـ Stage 2 بناءً على التأخير لأكثر من 30 يوماً.',
      'معدل التغطية الحالي يفي بالحد الأدنى لسياسة المخاطر المعتمدة.',
      'توصية: إعادة تقييم الضمانات العقارية المحتفظ بها للمرحلة 3 (Stage 3).'
    ]
  });

  const handleRecalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans dir-rtl" dir="rtl">
      {/* هيدر محرك IFRS 9 */}
      <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">محرك تدقيق IFRS 9 (الخسائر الائتمانية المتوقعة - ECL)</h2>
            <p className="text-xs text-slate-400">حساب وتحليل مخصصات التسهيلات والذمم وفق نموذج المراحل الثلاث (Stage 1 / 2 / 3)</p>
          </div>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-md text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${calculating ? 'animate-spin' : ''}`} />
          إعادة احتساب المخصص
        </button>
      </div>

      {/* كروت ملخص المراحل الثلاث */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">إجمالي التعرض الائتماني (Exposure)</span>
          <span className="text-xl font-bold font-mono text-slate-100">{auditResult.totalExposure.toLocaleString()} YER</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-emerald-500/30">
          <span className="text-xs text-emerald-400 block mb-1">Stage 1 (أداء طبيعي - 12M ECL)</span>
          <span className="text-xl font-bold font-mono text-emerald-400">{auditResult.stage1Ecl.toLocaleString()} YER</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30">
          <span className="text-xs text-amber-400 block mb-1">Stage 2 (ارتفاع مخاطر - Lifetime)</span>
          <span className="text-xl font-bold font-mono text-amber-400">{auditResult.stage2Ecl.toLocaleString()} YER</span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/30">
          <span className="text-xs text-rose-400 block mb-1">Stage 3 (تعثر - Lifetime)</span>
          <span className="text-xl font-bold font-mono text-rose-400">{auditResult.stage3Ecl.toLocaleString()} YER</span>
        </div>
      </div>

      {/* جدول التفاصيل والملاحظات */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-amber-500" />
          ملاحظات وتوصيات التدقيق المحاسبي (Audit Notes)
        </h3>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <ul className="space-y-2 text-xs text-slate-300">
            {auditResult.auditNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ifrs9EclViewer;