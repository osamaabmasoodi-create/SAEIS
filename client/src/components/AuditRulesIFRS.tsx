import React, { useState } from 'react';
import { ShieldCheck, Package, ArrowRight } from 'lucide-react';
import { Ifrs9EclViewer } from './Ifrs9EclViewer';
import { Ias2NrvViewer } from './Ias2NrvViewer';

export const AuditRulesIFRS: React.FC = () => {
  const [selectedStandard, setSelectedStandard] = useState<'IFRS9' | 'IAS2' | null>(null);

  // عرض محرك IFRS 9 عند الضغط على الكارت الخاص به
  if (selectedStandard === 'IFRS9') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedStandard(null)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للوحة المعايير
        </button>
        <Ifrs9EclViewer />
      </div>
    );
  }

  // عرض محرك IAS 2 عند الضغط على الكارت الخاص به
  if (selectedStandard === 'IAS2') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedStandard(null)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للوحة المعايير
        </button>
        <Ias2NrvViewer />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-100 font-sans" dir="rtl">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-amber-500" />
          قواعد الامتثال وتطبيق معايير IFRS / IAS
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          اختر المعيار المحاسبي لفحص التغطية والمخصصات بناءً على ميزان المراجعة
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* كارت IFRS 9 */}
        <div
          onClick={() => setSelectedStandard('IFRS9')}
          className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-md">
              IFRS 9
            </span>
            <ShieldCheck className="w-5 h-5 text-slate-500 group-hover:text-amber-500 transition" />
          </div>
          <h3 className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition">
            IFRS 9 - الأدوات المالية (ECL)
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            تطبيق نموذج الخسائر الائتمانية المتوقعة واستخراج مخصص الذمم والعملاء تلقائياً.
          </p>
        </div>

        {/* كارت IAS 2 */}
        <div
          onClick={() => setSelectedStandard('IAS2')}
          className="bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all duration-200 group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-md">
              IAS 2
            </span>
            <Package className="w-5 h-5 text-slate-500 group-hover:text-emerald-500 transition" />
          </div>
          <h3 className="text-base font-bold text-slate-200 group-hover:text-emerald-400 transition">
            IAS 2 - المخزون (NRV)
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            قياس التكلفة مقابل صافي القيمة القابلة للتحقق ومطابقة مخصص هبوط الأسعار.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditRulesIFRS;