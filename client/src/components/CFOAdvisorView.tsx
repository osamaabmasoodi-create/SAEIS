import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, Database, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ViolationItem {
  standard: string;
  desc: string;
  action?: string;
  impact?: string;
}

interface CfoAdvisorViewProps {
  auditData?: any;
}

export default function CfoAdvisorView({ auditData }: CfoAdvisorViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [erpType, setErpType] = useState('Onyx Pro');
  const [activeFileName, setActiveFileName] = useState('SAEIS_GlobalCo_25000_Accounts_ForUpload.xlsx');
  const [fileLabel, setFileLabel] = useState('ملف ميزان المراجعة الفعلي من جهازك');
  const [isDone, setIsDone] = useState(false);

  // حالات تفاعلية لدعم الأحجام الضخمة
  const [metrics, setMetrics] = useState({
    complianceScore: '97.8%',
    violationsCount: '16 قيود',
    ifrs16Impact: '$120,000',
    eclImpact: '$18,500',
    totalRowsAnalyzed: '5,000 حساب'
  });

  const [violationsList, setViolationsList] = useState<ViolationItem[]>([
    { 
      standard: 'IAS 16', 
      desc: 'رأسملة مصاريف غير مؤهلة عبر الأصول الضخمة', 
      action: 'فصل وتصحيح قيود الأصول الثابتة والصيانة', 
      impact: '$7,200' 
    },
    { 
      standard: 'IFRS 16', 
      desc: 'معالجة محفظة عقود الإيجار الشاملة', 
      action: 'إثبات أصل حق الاستخدام والتزام الإيجار الموحد', 
      impact: '$24,000' 
    },
    { 
      standard: 'IFRS 9', 
      desc: 'نموذج الخسائر الائتمانية المتوقعة (ECL)', 
      action: 'تكوين مخصصات الديون المشكوك فيها حسب شرائح المخاطر', 
      impact: '$3,700' 
    },
    { 
      standard: 'IFRS 15', 
      desc: 'تدقيق الاعتراف بالإيرادات وعقود العملاء', 
      action: 'إعادة تخصيص التزامات الأداء والإيرادات المؤجلة', 
      impact: '$9,000' 
    }
  ]);

  // تحديث القيم تلقائياً عند استقبال البيانات الحقيقية
  React.useEffect(() => {
    if (auditData) {
      setMetrics({
        complianceScore: `${auditData.complianceRate || 100}%`,
        violationsCount: `${auditData.issuesCount || 0} قيود`,
        ifrs16Impact: '$0',
        eclImpact: '$0',
        totalRowsAnalyzed: `${auditData.totalRows || 1000} حساب`
      });
    }
  }, [auditData]);

  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'أهلاً بك يا أسامة. أنا المستشار المالي الذكي، جاهز للإجابة وتدقيق الـ IFRS.' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userText = inputValue;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputValue('');
    setTimeout(() => {
      let aiReply = "بناءً على مراجعة المعايير الدولية وقواعد البيانات المرفوعة، النظام يعمل بكفاءة عالية وفق متطلبات IFRS.";
      if (userText.includes('امتثال') || userText.includes('نسبة')) {
        aiReply = `مؤشر الامتثال الحالي للملف هو ${metrics.complianceScore}.`;
      } else if (userText.includes('قيود') || userText.includes('مخالفات')) {
        aiReply = `إجمالي التحفظات المكتشفة بلغ ${metrics.violationsCount}.`;
      }
      setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس الشاشة */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            CFO AI المستشار المالي الذكي (CFO Advisor & Assistant Engine)
          </h2>
          <p className="text-xs text-slate-400">
            مساعدك الذكي للإجابة عن الاستفسارات المحاسبية وتحليل التوصيات المالية وفق وتدقيق الـ IFRS مع ربط مباشر بالـ ERP.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          المحرك الذكي متصل (Active)
        </span>
      </div>

      {/* المؤشرات العلوية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">مؤشر الامتثال IFRS</span>
          <span className="text-lg font-bold text-emerald-400">{metrics.complianceScore}</span>
          <span className="text-[10px] text-emerald-500/80">مرتفع جداً ومطابق للمتطلبات</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">القيود والمخالفات</span>
          <span className="text-lg font-bold text-amber-400">{metrics.violationsCount}</span>
          <span className="text-[10px] text-amber-500/80">تتطلب مراجعة تسوية</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">إجمالي الحسابات المفحوصة</span>
          <span className="text-lg font-bold text-blue-400">{metrics.totalRowsAnalyzed}</span>
          <span className="text-[10px] text-blue-500/80">دعم قواعد البيانات الكبرى</span>
        </div>
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
          <span className="text-[11px] text-slate-400">حالة الربط السحابي</span>
          <span className="text-lg font-bold text-emerald-400">نشط (Active)</span>
          <span className="text-[10px] text-slate-400">مزامنة لحظية مع النظام</span>
        </div>
      </div>

      {/* جدول التحفظات المكتشفة */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          التحفظات المكتشفة وقيد التسوية المقترح وفق معايير IFRS
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs text-slate-200">
            <thead>
              <tr className="bg-slate-900 text-slate-300 text-[11px]">
                <th className="p-2.5 text-right border border-slate-800">المعيار</th>
                <th className="p-2.5 text-right border border-slate-800">وصف المعالجة الحالية</th>
                <th className="p-2.5 text-right border border-slate-800">التصحيح المقترح</th>
                <th className="p-2.5 text-right border border-slate-800">الأثر المالي ($)</th>
              </tr>
            </thead>
            <tbody>
              {violationsList.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-2.5 border border-slate-800 font-bold text-amber-400">{item.standard}</td>
                  <td className="p-2.5 border border-slate-800 text-slate-300">{item.desc}</td>
                  <td className="p-2.5 border border-slate-800 text-emerald-400">{item.action || 'تصحيح قيود'}</td>
                  <td className="p-2.5 border border-slate-800 font-mono text-white">{item.impact || '$0'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* شات المستشار الذكي */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between h-[45vh] overflow-hidden">
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed font-sans ${
                msg.sender === 'user' 
                  ? 'bg-slate-800 text-slate-200 border border-slate-700' 
                  : 'bg-amber-600 text-white font-medium shadow-md'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendChat} className="mt-4 flex gap-2 pt-3 border-t border-slate-800">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اسأل المستشار الذكي عن نسبة الامتثال، التحفظات، أو التوجيهات المحاسبية..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg"
          >
            إرسال
          </button>
        </form>
      </div>
    </div>
  );
}