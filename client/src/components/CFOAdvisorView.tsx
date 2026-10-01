import React, { useState } from 'react';

interface Recommendation {
  id: number;
  title: string;
  category: string;
  impact: string;
  type: 'critical' | 'warning' | 'opportunity';
  description: string;
  actionPlan: string;
}

const CFOAdvisorView: React.FC = () => {
  const [userQuery, setUserQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'أهلاً بك أستاذ أسامة. أنا المستشار الذكي (CFO AI) المربوط بمحرك SAEIS. بناءً على القيود التي تم فحصها اليوم (100,002 قيد)، قمت بإعداد التقرير التنفيذي أدناه. كيف يمكنني مساعدتك في التحليل اليوم؟',
    },
  ]);

  const recommendations: Recommendation[] = [
    {
      id: 1,
      title: 'خسائر انخفاض قيمة المخزون (NRV)',
      category: 'IAS 2 - المخزون',
      impact: '-$185,004 على صافي الربح',
      type: 'critical',
      description: 'تم تقييم اصناف من المخزون بطيء الحركة بأعلى من القيمة القابلة للتحقق. يجب تكوين مخصص هبوط أسعار بـ 185,004 دولار لتفادي تضخيم الأصول.',
      actionPlan: 'اعتماد قيد التسوية من محرك التصحيح وتصديره مباشرة إلى نظام الـ ERP.',
    },
    {
      id: 2,
      title: 'إعادة تصنيف مصاريف الصيانة الدورية',
      category: 'IAS 16 - الأصول الثابتة',
      impact: '-$65,001 على صافي الربح',
      type: 'warning',
      description: 'رصد مصاريف صيانة دورية تم رسمالتها خطأً كأصل ثابت مما أدى إلى تضخيم صافي أرباح الفترة وصافي قيمة الأصول.',
      actionPlan: 'تحويل المبلغ لحساب مصاريف التشغيل وإلغاء مجمع الإهلاك المتراكم المرتبط بها.',
    },
    {
      id: 3,
      title: 'تحسين التدفقات النقدية ورأس المال العامل',
      category: 'إدارة السيولة',
      impact: 'تحسين متوقع بـ +12%',
      type: 'opportunity',
      description: 'عند تسوية التعديلات أعلاه، يوصى بإعادة جدول دفعات الموردين وتخفيض حجم الطلبيات للمخزون بطيء الحركة.',
      actionPlan: 'مراجعة حد إعادة الطلب للأصناف البطيئة وتوجيه إدارة المشتريات بذلك.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const newChat = [...chatHistory, { sender: 'user' as const, text: userQuery }];
    setChatHistory(newChat);
    setUserQuery('');

    // رد المستشار الذكي الآلي
    setTimeout(() => {
      let aiResponse = 'بناءً على تحليلي للبيانات المالية الحالية في SAEIS: ينصح بالبدء بتسوية قيود المخزون أولاً لتفادي أي ملاحظات من المراجع الخارجي أثناء تدقيق القوائم المالية.';
      if (userQuery.includes('مخزون') || userQuery.includes('IAS 2')) {
        aiResponse = 'بالنسبة للمخزون (IAS 2)، التعديل المطلوب بـ $185,004 يخفض الأرباح المدورة ولكن يعكس القيمة الاستردادية الحقيقية ويمنع المخاطر الضريبية.';
      } else if (userQuery.includes('أصول') || userQuery.includes('IAS 16')) {
        aiResponse = 'فيما يخص IAS 16، تم معالجة $65,001 من الصيانة الدورية، حيث تشترط الفقرة 12 إثباتها فوراً كمصروف تشغيلي وعدم رسمالتها.';
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 600);
  };

  return (
    <div className="space-y-6 dir-rtl">
      {/* العنونة والتنفيذ */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🤖 المستشار الذكي (CFO AI Dashboard)
          </h2>
          <p className="text-xs text-slate-400">
            تحليل الاستشارات التنفيذية والأثر المالي وفق معايير IFRS
          </p>
        </div>
        <div className="bg-indigo-900/30 border border-indigo-500/30 px-4 py-2 rounded-xl text-xs text-indigo-300 font-semibold">
          حالة المحلل: متصل ومطابق للبيانات الحالية ⚡
        </div>
      </div>

      {/* بطاقات الملاحظات والتوصيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <div
            key={item.id}
            className="bg-[#1e293b]/90 border border-slate-700/70 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.type === 'critical'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : item.type === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {item.type === 'critical' ? 'تأثير حرج' : item.type === 'warning' ? 'تنبيه مهم' : 'فرصة تحسين'}
                </span>
              </div>
              <h3 className="font-bold text-sm text-white">{item.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-700/50 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400">الأثر المالي: {item.impact}</div>
              <div className="bg-[#0f172a] p-2.5 rounded-xl text-[11px] text-slate-400">
                <span className="text-indigo-400 font-semibold">خطة العمل: </span>
                {item.actionPlan}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* شات الاستفسارات المباشرة مع المستشار الذكي */}
      <div className="bg-[#1e293b]/90 border border-slate-700/70 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-700/60 pb-3">
          💬 محادثة واستشارات مالية مباشرة مع CFO AI
        </h3>

        {/* منطقة الرسائل */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 bg-[#0f172a] rounded-xl border border-slate-800 text-xs dir-rtl">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-bl-none'
                    : 'bg-[#1e293b] text-slate-200 border border-slate-700 rounded-br-none'
                }`}
              >
                <div className="font-bold text-[10px] opacity-75 mb-1">
                  {msg.sender === 'user' ? 'أنت' : 'المستشار الذكي (CFO AI)'}
                </div>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* حقل الإرسال */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="اكتب استفسارك المالي أو طلب التحليل من المستشار الذكي هنا..."
            className="flex-1 bg-[#0f172a] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md"
          >
            إرسال 🚀
          </button>
        </form>
      </div>
    </div>
  );
};

export default CFOAdvisorView;