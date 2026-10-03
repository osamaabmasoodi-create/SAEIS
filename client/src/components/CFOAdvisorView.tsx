import React from 'react';

interface CFOAdvisorProps {
  auditData?: any[];
}

export default function CFOAdvisorView({ auditData = [] }: CFOAdvisorProps) {
  return (
    <div className="bg-[#1f2937] border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h3 className="text-lg font-bold text-white">المستشار الذكي (CFO AI)</h3>
        <p className="text-xs text-slate-400 mt-1">تحليل مؤشرات الأداء والبيانات المالية ({auditData.length.toLocaleString()} سجل متاح)</p>
      </div>
      
      <div className="bg-[#111827] border border-slate-700 rounded-xl p-4 text-slate-300 text-sm leading-relaxed">
        أهلاً بك يا أسامة، المستشار المالي جاهز لتحليل البيانات المدخلة وإعطائك التوصيات المحاسبية والمالية بدقة عالية.
      </div>
    </div>
  );
}