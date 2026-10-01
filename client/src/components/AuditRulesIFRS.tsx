import React from 'react';

export const AuditRulesIFRS: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-100 dir-rtl" dir="rtl">
      {/* 1. العنوان الرئيسي */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-md">
        <h1 className="text-xl font-bold text-amber-400 mb-2">📋 قواعد الامتثال وتطبيق معايير IFRS / IAS</h1>
        <p className="text-xs text-slate-400">
          دليل القواعد المحاسبية الذكية المطبقة للتحقق من سلامة القوائم والقيود المباشرة.
        </p>
      </div>

      {/* 2. بطاقات القواعد والمعايير */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-emerald-400">IAS 16 - العقارات والآلات والمعدات</h3>
          <p className="text-xs text-slate-300">
            التحقق من عدم تحميل المصاريف التشغيلية والصيانة الدورية على أصل ثابت، والتأكد من صحة نسب الإهلاك.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-emerald-400">IFRS 16 - عقود الإيجار</h3>
          <p className="text-xs text-slate-300">
            إثبات أصول حق الاستخدام (ROU Assets) والتزامات الإيجار لعقود التشغيل طويلة الأجل.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-emerald-400">IFRS 9 - الأدوات المالية</h3>
          <p className="text-xs text-slate-300">
            احتساب نموذج الخسائر الائتمانية المتوقعة (ECL) للذمم والعملاء بناءً على التحليل الزمني.
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <h3 className="font-bold text-emerald-400">IFRS 15 - الإيرادات من العقود</h3>
          <p className="text-xs text-slate-300">
            تأجيل إثبات الإيرادات المقدمة لحين نقل السيطرة الفعلية للسلع أو الخدمات وفق الخطوات الخمس.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditRulesIFRS;