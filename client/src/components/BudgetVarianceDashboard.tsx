import React, { useState } from 'react';

interface BudgetItem {
  id: number;
  costCenter: string;
  category: string;
  budgeted: number;
  actual: number;
  thresholdPercent: number; // النسبة المسموحة للتجاوز (مثلاً 10%)
}

export default function BudgetVarianceDashboard() {
  // بيانات تجريبية لمراكز التكلفة وبنود المصروفات
  const [items, setItems] = useState<BudgetItem[]>([
    { id: 1, costCenter: 'التشغيل والصيانة', category: 'مصروفات عمومية', budgeted: 50000, actual: 48000, thresholdPercent: 10 },
    { id: 2, costCenter: 'التسويق والمبيعات', category: 'حملات إعلانية', budgeted: 30000, actual: 34500, thresholdPercent: 10 },
    { id: 3, costCenter: 'الموارد البشرية', category: 'تدريب وتوظيف', budgeted: 20000, actual: 23000, thresholdPercent: 10 },
    { id: 4, costCenter: 'التقنية والتطوير', category: 'تراخيص وسيرفرات', budgeted: 15000, actual: 14000, thresholdPercent: 10 },
  ]);

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen rounded-2xl border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-amber-500">لوحة تحكم وتنبوء الميزانية</h2>
          <p className="text-xs text-slate-400">مقارنة لحظية بين الموازنة التقديرية والفعلي مع إطلاق تنبيهات ذكية للانحراف</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400">إجمالي الموازنة</span>
          <h3 className="text-2xl font-bold mt-1 text-slate-100">
            {items.reduce((acc, item) => acc + item.budgeted, 0).toLocaleString()} ر.ي
          </h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400">إجمالي المصروف الفعلي</span>
          <h3 className="text-2xl font-bold mt-1 text-slate-100">
            {items.reduce((acc, item) => acc + item.actual, 0).toLocaleString()} ر.ي
          </h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400">حالة الانحراف العام</span>
          <h3 className="text-xl font-bold mt-1 text-amber-400">مراقب بالذكاء الاصطناعي</h3>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <span className="text-xs text-slate-400">التنبيهات النشطة</span>
          <h3 className="text-2xl font-bold mt-1 text-rose-500">
            {items.filter(item => ((item.actual - item.budgeted) / item.budgeted) * 100 > item.thresholdPercent).length} تنبيهات
          </h3>
        </div>
      </div>

      {/* جدول البيانات وتحليل الانحرافات */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-slate-800 text-slate-400 text-xs border-b border-slate-700">
              <th className="p-3">مركز التكلفة</th>
              <th className="p-3">البند</th>
              <th className="p-3">الموازنة (Budget)</th>
              <th className="p-3">الفعلي (Actual)</th>
              <th className="p-3">نسبة الانحراف</th>
              <th className="p-3">الحالة / التنبيه</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {items.map((item) => {
              const variance = item.actual - item.budgeted;
              const variancePercent = (variance / item.budgeted) * 100;
              const isExceeded = variancePercent > item.thresholdPercent;

              return (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-medium">{item.costCenter}</td>
                  <td className="p-3 text-slate-400 text-xs">{item.category}</td>
                  <td className="p-3">{item.budgeted.toLocaleString()} ر.ي</td>
                  <td className="p-3">{item.actual.toLocaleString()} ر.ي</td>
                  <td className={`p-3 font-semibold ${variance > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {variance > 0 ? `+${variance.toLocaleString()}` : variance.toLocaleString()} ({variancePercent.toFixed(1)}%)
                  </td>
                  <td className="p-3">
                    {isExceeded ? (
                      <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        ⚠️ تجاوز النسبة المسموحة
                      </span>
                    ) : (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        ✅ ضمن النسبة الآمنة
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}