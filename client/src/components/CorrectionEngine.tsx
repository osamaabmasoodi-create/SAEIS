// @ts-nocheck
import React, { useState } from 'react';
import { useApp } from './AppContext';
import { ArrowRightLeft, BookOpen, Layers, TrendingDown, ShieldCheck, CheckCircle2, Zap, FileSpreadsheet } from 'lucide-react';

export const CorrectionEngine: React.FC = () => {
  const context = useApp() as any;
  const varianceAmount = context?.balanceDifference || context?.uploadedData?.varianceAmount || 8606704.47;

  const [postedEntries, setPostedEntries] = useState<{ [key: number]: boolean }>({});
  const [isPostingAll, setIsPostingAll] = useState(false);

  const generatedEntries = [
    {
      id: 1,
      accountCodeDebit: "120101",
      accountCodeCredit: "510204",
      description: "إعادة تصنيف أصل أدوات مكتبية استهلاكية مسجلة خطأ كمصروفات عمومية",
      debitAccount: "الأصول الثابتة (معدات)",
      creditAccount: "حساب المصروفات العمومية",
      amount: Math.round(varianceAmount * 0.15) || 1291006,
      standard: "IAS 16",
      paragraph: "الفقرة 7 (IAS 16.7)",
      riskLevel: "تعديل تصنيفي",
      riskClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      standardText: "يتم الاعتراف بتكلفة عنصر من الممتلكات والآلات والمعدات كأصل إذا وفقط إذا كان من المحتمل أن تدفق منافع إقتصادية مستقبلية مرتبطة بالأصل إلى المنشأة ويمكن قياس تكلفة الأصل بشكل موثوق."
    },
    {
      id: 2,
      accountCodeDebit: "520108",
      accountCodeCredit: "130901",
      description: "إثبات مخصص هبوط أسعار المخزون الراكد للفترة الحالية (صافي القيمة القابلة للتحقق)",
      debitAccount: "مصروف هبوط مخزون (أرباح وخسائر)",
      creditAccount: "مخصص هبوط مخزون",
      amount: Math.round(varianceAmount * 0.25) || 2151676,
      standard: "IAS 2",
      paragraph: "الفقرة 9 (IAS 2.9)",
      riskLevel: "مخاطر متوسطة",
      riskClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      standardText: "يجب أن يُقاس المخزون بالتكلفة أو صافي القيمة القابلة للتحقق أيهما أقل. وتُعالج الفروقات بالخفض في قائمة الربح أو الخسارة فوراً."
    },
    {
      id: 3,
      accountCodeDebit: "140101",
      accountCodeCredit: "220301",
      description: "إثبات أصل حق الاستخدام والالتزام الإيجاري السنوي الخصوم لربط العقود طويلة الأجل",
      debitAccount: "أصول حق الاستخدام (ROU Assets)",
      creditAccount: "التزامات عقود الإيجار طويلة الأجل",
      amount: Math.round(varianceAmount * 0.60) || 5164023,
      standard: "IFRS 16",
      paragraph: "الفقرة 22 (IFRS 16.22)",
      riskLevel: "مخاطر جوهرية",
      riskClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      standardText: "في تاريخ البدء، يجب على المستأجر الاعتراف بأصل حق الاستخدام والالتزام الإيجاري مقاساً بالقيمة الحالية لمدفوعات الإيجار غير المدفوعة في ذلك التاريخ."
    }
  ];

  const handlePostSingle = (id: number) => {
    setPostedEntries((prev) => ({ ...prev, [id]: true }));
  };

  const handlePostAll = () => {
    setIsPostingAll(true);
    setTimeout(() => {
      setPostedEntries({ 1: true, 2: true, 3: true });
      setIsPostingAll(false);
    }, 1200);
  };

  const allPosted = Object.keys(postedEntries).length === generatedEntries.length && Object.values(postedEntries).every(Boolean);

  return (
    <div className="space-y-6 text-right font-sans" dir="rtl">
      {/* الهيدر الرئيسي مع زر الترحيل الجماعي */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-lg flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-amber-500" />
            <span>محرك التسوية والتصحيح الآلي (Automated Adjustment Entries Engine)</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            توليد قيود التسوية آلياً ومربوطة بالفقرات المعيارية لـ IFRS لملف ({context?.fileName || "SAEIS_Master_Audit_Demo_3000.xlsx"})
          </p>
        </div>

        <button
          onClick={handlePostAll}
          disabled={isPostingAll || allPosted}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all ${
            allPosted
              ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
              : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-amber-600/20'
          }`}
        >
          {allPosted ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>تم ترحيل جميع القيود للـ ERP</span>
            </>
          ) : isPostingAll ? (
            <>
              <Zap className="w-5 h-5 animate-bounce text-amber-200" />
              <span>جاري ترحيل القيود عبر API...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>ترحيل كافة التسويات دفعة واحدة</span>
            </>
          )}
        </button>
      </div>

      {/* بطاقات أثر التسويات على القوائم المالية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">الأثر الإيجابي على الأصول</span>
            <h4 className="text-lg font-bold text-emerald-400">+$6,455,029</h4>
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">الأثر على قائمة الدخل (المصروفات)</span>
            <h4 className="text-lg font-bold text-rose-400">-$2,151,676</h4>
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">حالة الربط مع الـ ERP</span>
            <h4 className="text-lg font-bold text-amber-400">
              {allPosted ? "مكتمل الترحيل بنجاح" : "جاهز للترحيل الآلي"}
            </h4>
          </div>
        </div>
      </div>

      {/* جدول القيود المعزز بالنص المعياري وشجرة الحسابات */}
      <div className="bg-slate-900/80 rounded-xl border border-slate-800 overflow-hidden shadow">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700 font-semibold text-slate-200 flex justify-between items-center">
          <span>قيود التسوية المقترحة والأساس المعياري المعتمد</span>
          <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            مطابق لمتطلبات IFRS / IAS
          </span>
        </div>

        <div className="divide-y divide-slate-800">
          {generatedEntries.map((entry) => (
            <div key={entry.id} className="p-5 hover:bg-slate-800/30 transition-colors space-y-3">
              <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-400 font-bold rounded-md">
                      {entry.standard}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 bg-slate-800 text-slate-300 font-medium rounded-md border border-slate-700">
                      {entry.paragraph}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${entry.riskClass}`}>
                      {entry.riskLevel}
                    </span>
                    <h3 className="text-base font-bold text-white mr-2">{entry.description}</h3>
                  </div>

                  <div className="flex items-center gap-6 mt-3 text-sm flex-wrap">
                    <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-xs">مدين [{entry.accountCodeDebit}]: </span>
                      <span className="text-emerald-400 font-bold">{entry.debitAccount}</span>
                    </div>
                    <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-xs">دائن [{entry.accountCodeCredit}]: </span>
                      <span className="text-rose-400 font-bold">{entry.creditAccount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left">
                    <span className="text-xs text-slate-400 block">المبلغ المحسوب</span>
                    <span className="text-xl font-extrabold text-white">${entry.amount.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handlePostSingle(entry.id)}
                    disabled={postedEntries[entry.id]}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all shadow ${
                      postedEntries[entry.id]
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    {postedEntries[entry.id] ? 'تم الترحيل' : 'ترحيل للـ ERP'}
                  </button>
                </div>
              </div>

              {/* المرجع المعياري */}
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-400 ml-1">المرجع المعياري ({entry.paragraph}):</span>
                  <span className="italic text-slate-300">"{entry.standardText}"</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CorrectionEngine;