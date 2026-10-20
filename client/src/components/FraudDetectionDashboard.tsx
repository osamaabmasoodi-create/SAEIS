import React, { useState } from 'react';

interface FraudItem {
  id: number;
  entryNumber: string;
  vendorName: string;
  riskType: string;
  amount: number;
  timestamp: string;
  riskLevel: 'عالي' | 'متوسط' | 'منخفض';
  reason: string;
}

export default function FraudDetectionDashboard() {
  const [filterLevel, setFilterLevel] = useState<string>('الكل');

  // بيانات افتراضية ونماذج شذوذ مكتشفة بالذكاء الاصطناعي
  const [fraudRecords, setFraudRecords] = useState<FraudItem[]>([
    {
      id: 101,
      entryNumber: 'JE-2026-9012',
      vendorName: 'مؤسسة النور للتجارة',
      riskType: 'فواتير مجزأة لتفادي صلاحيات الاعتماد',
      amount: 4900,
      timestamp: '2026-10-18 14:22',
      riskLevel: 'عالي',
      reason: 'تم إصدار 3 فواتير متتالية بقيمة 4,900$ لكل منها في نفس اليوم، لتفادي حد الاعتماد المالي (5,000$).'
    },
    {
      id: 102,
      entryNumber: 'JE-2026-8834',
      vendorName: 'شركة التقنية المتقدمة',
      riskType: 'قيد مدخل خارج أوقات الدوام الرسمي',
      amount: 18500,
      timestamp: '2026-10-17 02:30',
      riskLevel: 'متوسط',
      reason: 'تم ترحيل القيد المحاسبي في الساعة 2:30 صباحاً يوم الجمعة بواسطة حساب مستخدم فرعي.'
    },
    {
      id: 103,
      entryNumber: 'JE-2026-7721',
      vendorName: 'مكتب الإنجاز للخدمات',
      riskType: 'تكرار قيد مصروفات لنفس المورد',
      amount: 1200,
      timestamp: '2026-10-16 11:15',
      riskLevel: 'عالي',
      reason: 'وجود قيدين بنفس القيمة والبيان ورقم الفاتورة خلال أقل من 24 ساعة.'
    },
    {
      id: 104,
      entryNumber: 'JE-2026-6540',
      vendorName: 'توريدات الأيقونة السريعة',
      riskType: 'انحراف غير طبيعي في قيمة المصروفات',
      amount: 32000,
      timestamp: '2026-10-15 09:45',
      riskLevel: 'منخفض',
      reason: 'المصروف يتجاوز متوسط الإنفاق التاريخي لهذا البند بنسبة 250%.'
    }
  ]);

  const filteredRecords = filterLevel === 'الكل' 
    ? fraudRecords 
    : fraudRecords.filter(item => item.riskLevel === filterLevel);

  const handleResolve = (id: number) => {
    setFraudRecords(prev => prev.filter(item => item.id !== id));
    alert(`تمت معالجة القيد وتصنيفه كـ "مفحوص ومبرر" بنجاح.`);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس الغرفة */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            غرفة التحكم باكتشاف الاحتيال والشذوذ (AI Fraud & Anomaly Detection Dashboard)
          </h2>
          <p className="text-xs text-slate-400">
            رصد وتحليل القيود المشبوهة، تجزئة الفواتير، والعمليات الخارجة عن أوقات الدوام الرسمي باستخدام خوارزميات الذكاء الاصطناعي.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
          الرقابة الذكية نشطة
        </span>
      </div>

      {/* شريط الإحصائيات والفلاتر */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">إجمالي الحالات المرصودة</span>
          <span className="text-xl font-bold text-white">{fraudRecords.length} حالات</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">مخاطر عالية تتطلب تدخلاً</span>
          <span className="text-xl font-bold text-rose-400">
            {fraudRecords.filter(i => i.riskLevel === 'عالي').length} حالات
          </span>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">فلاتر مستوى الخطورة</span>
          <div className="flex gap-1 mt-1">
            {['الكل', 'عالي', 'متوسط', 'منخفض'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                  filterLevel === lvl ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">حالة نموذج التعلم الآلي</span>
          <span className="text-sm font-bold text-emerald-400 mt-1">Model v2.4 Active</span>
        </div>
      </div>

      {/* جدول الحالات المكتشفة */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          قائمة الشذوذ والقيود المشبوهة المرصودة
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-900 text-slate-300">
                <th className="p-2.5 text-right border border-slate-800">رقم القيد</th>
                <th className="p-2.5 text-right border border-slate-800">المورد / الطرف</th>
                <th className="p-2.5 text-right border border-slate-800">نوع الشذوذ / المخاطرة</th>
                <th className="p-2.5 text-right border border-slate-800">المبلغ ($)</th>
                <th className="p-2.5 text-right border border-slate-800">وقت الرصد</th>
                <th className="p-2.5 text-center border border-slate-800">مستوى الخطورة</th>
                <th className="p-2.5 text-right border border-slate-800">تحليل الذكاء الاصطناعي والسبب</th>
                <th className="p-2.5 text-center border border-slate-800">الإجراء</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-2.5 border border-slate-800 font-mono font-bold text-amber-400">{item.entryNumber}</td>
                  <td className="p-2.5 border border-slate-800 font-bold">{item.vendorName}</td>
                  <td className="p-2.5 border border-slate-800 text-rose-400 font-bold">{item.riskType}</td>
                  <td className="p-2.5 border border-slate-800 font-mono text-white">${item.amount.toLocaleString()}</td>
                  <td className="p-2.5 border border-slate-800 font-mono text-slate-400 text-[10px]">{item.timestamp}</td>
                  <td className="p-2.5 border border-slate-800 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.riskLevel === 'عالي' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      item.riskLevel === 'متوسط' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </td>
                  <td className="p-2.5 border border-slate-800 text-[10px] text-slate-300 leading-relaxed max-w-xs">{item.reason}</td>
                  <td className="p-2.5 border border-slate-800 text-center">
                    <button
                      onClick={() => handleResolve(item.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition shadow"
                    >
                      اعتماد وتبرير
                    </button>
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