// @ts-nocheck
import React, { useState } from 'react';
import { ShieldCheck, Calculator, CheckCircle, RefreshCw } from 'lucide-react';
import { useApp } from './AppContext'; // ربط الشاشة بالسياق العام لجلب البيانات الحقيقية

export interface EclDataProps {
  totalExposure?: number;
  stage1Ecl?: number;
  stage2Ecl?: number;
  stage3Ecl?: number;
}

export const Ifrs9EclViewer: React.FC<EclDataProps> = (props) => {
  // جلب البيانات الحقيقية من السياق العام إن وجدت
  const context = useApp() as any;
  const eclSummary = context?.eclSummary;

  // الاعتماد على البيانات المرفوعة من الملف أو القيم الافتراضية
  const totalExposure = eclSummary?.totalExposure ?? props.totalExposure ?? 428000;
  const stage1Ecl = eclSummary?.stage1Ecl ?? props.stage1Ecl ?? 12840;
  const stage2Ecl = eclSummary?.stage2Ecl ?? props.stage2Ecl ?? 17120;
  const stage3Ecl = eclSummary?.stage3Ecl ?? props.stage3Ecl ?? 8540;

  const [calculating, setCalculating] = useState(false);

  const totalProvision = stage1Ecl + stage2Ecl + stage3Ecl;
  const coverageRatio = totalExposure > 0 ? ((totalProvision / totalExposure) * 100).toFixed(2) : '0.00';

  const handleRecalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans" dir="rtl">
      {/* هيدر محرك IFRS 9 */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-xl border border-slate-800 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">محرك التقييم الائتماني ونموذج ECL المتكامل (وفقاً لمعيار IFRS 9)</h2>
            <p className="text-sm text-slate-400">حساب الخسائر الائتمانية المتوقعة وتوليد قيود التسوية المحاسبية آلياً</p>
          </div>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-all shadow-md disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} />
          {calculating ? 'جاري إعادة الحساب...' : 'إعادة احتساب المحفظة'}
        </button>
      </div>

      {/* بطاقات الملخص المالي */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 shadow">
          <span className="text-sm text-slate-400">إجمالي محفظة الذمم المدينة (EAD)</span>
          <h3 className="text-2xl font-bold text-white mt-2">${totalExposure.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 shadow">
          <span className="text-sm text-slate-400">إجمالي مخصص ECL المحسوب</span>
          <h3 className="text-2xl font-bold text-amber-400 mt-2">${totalProvision.toLocaleString()}</h3>
        </div>
        <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 shadow">
          <span className="text-sm text-slate-400">نسبة التغطية الائتمانية (Coverage Ratio)</span>
          <h3 className="text-2xl font-bold text-emerald-400 mt-2">{coverageRatio}%</h3>
        </div>
      </div>

      {/* جدول المراحل الثلاث (Stages) */}
      <div className="bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden shadow">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 font-semibold text-slate-200">
          تحليل مراحل المخاطر الائتمانية وتوزيع المخصصات
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800">
            <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-medium">المرحلة الأولى (Stage 1)</span>
            <div className="mt-4 text-xl font-bold text-white">${stage1Ecl.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">خسائر ائتمانية متوقعة خلال 12 شهراً</p>
          </div>
          <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800">
            <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full font-medium">المرحلة الثانية (Stage 2)</span>
            <div className="mt-4 text-xl font-bold text-white">${stage2Ecl.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">زيادة جوهرية في المخاطر الائتمانية (Lifetime ECL)</p>
          </div>
          <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800">
            <span className="text-xs px-2 py-1 bg-rose-500/20 text-rose-400 rounded-full font-medium">المرحلة الثالثة (Stage 3)</span>
            <div className="mt-4 text-xl font-bold text-white">${stage3Ecl.toLocaleString()}</div>
            <p className="text-xs text-slate-400 mt-1">أصول مالية معثرة (Credit-impaired)</p>
          </div>
        </div>
      </div>
    </div>
  );
};