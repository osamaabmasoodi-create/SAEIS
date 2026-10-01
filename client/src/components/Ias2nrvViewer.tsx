import React, { useState } from 'react';
import { Package, AlertTriangle, CheckCircle, RefreshCw, Layers } from 'lucide-react';

export interface Ias2NrvProps {
  inventoryCost?: number;
  estimatedSellingPrice?: number;
  completionCosts?: number;
}

export const Ias2NrvViewer: React.FC<Ias2NrvProps> = ({
  inventoryCost = 428000,
  estimatedSellingPrice = 410000,
  completionCosts = 20500,
}) => {
  const [calculating, setCalculating] = useState(false);

  const nrv = estimatedSellingPrice - completionCosts;
  const requiredWriteDown = inventoryCost > nrv ? inventoryCost - nrv : 0;
  const isImpaired = requiredWriteDown > 0;

  const handleRecalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      setCalculating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans" dir="rtl">
      <div className="flex justify-between items-center bg-slate-900/80 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              محرك تدقيق معيار IAS 2 (قياس المخزون - NRV)
            </h2>
            <p className="text-xs text-slate-400">
              تقييم المخزون بالتكلفة أو صافي القيمة القابلة للتحقق (أيهما أقل)
            </p>
          </div>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${calculating ? 'animate-spin' : ''}`} />
          إعادة تقييم NRV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">
            تكلفة المخزون الدفترية (حساب 103001)
          </span>
          <span className="text-lg font-bold font-mono text-slate-100">
            {inventoryCost.toLocaleString()} YER
          </span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-blue-500/30">
          <span className="text-xs text-blue-400 block mb-1">
            صافي القيمة القابلة للتحقق (NRV)
          </span>
          <span className="text-lg font-bold font-mono text-blue-400">
            {nrv.toLocaleString()} YER
          </span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-rose-500/30">
          <span className="text-xs text-rose-400 block mb-1">
            مخصص انخفاض الأسعار المطلوب
          </span>
          <span className="text-lg font-bold font-mono text-rose-400">
            {requiredWriteDown.toLocaleString()} YER
          </span>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30">
          <span className="text-xs text-amber-400 block mb-1">حالة التقييم</span>
          <span className={`text-sm font-bold ${isImpaired ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isImpaired ? 'يوجد هبوط في القيمة' : 'المخزون مقيم بالتكلفة سليمة'}
          </span>
        </div>
      </div>

      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-500" />
          نتائج مطابقة وتوصيات تدقيق المخزون (IAS 2)
        </h3>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                تم سحب رصيد المخزون السلعي (103001) بقيمة <strong>{inventoryCost.toLocaleString()} YER</strong>.
              </span>
            </li>
            {isImpaired ? (
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  صافي القيمة القابلة للتحقق (NRV) أقل من التكلفة بمقدار{' '}
                  <strong>{requiredWriteDown.toLocaleString()} YER</strong>.
                  قيد التسوية المقترح: مدين/ مصاريف انخفاض قيمة المخزون — دائن/ مخصص انخفاض قيمة المخزون (204001).
                </span>
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  صافي القيمة القابلة للتحقق أكبر من التكلفة الدفترية، لا يلزم تكوين مخصص إضافي وفق معيار IAS 2.
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ias2NrvViewer;