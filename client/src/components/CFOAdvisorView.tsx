import React, { useState } from 'react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    tabTarget: string;
  };
  journalEntrySnippet?: {
    debitAcc: string;
    creditAcc: string;
    amount: number;
    statement: string;
  };
}

export default function CfoAdvisorView({ auditData }: { auditData?: any }) {
  const initialMessage: ChatMessage = {
    id: 1,
    sender: 'ai',
    text: 'أهلاً بك يا أسامة. أنا مستشارك المالي الذكي (CFO AI). يمكنك سؤالي عن أي استحداثات محاسبية وفق معيار IFRS، تحليل قيود الـ ERP، أو مراجعة التدفقات والنقاط الحرجة.',
    timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const quickQuestions = [
    'ماهو الهدف من معيار IFRS 16؟',
    'ما أثر معيار IFRS 16 على الأصول والالتزامات؟',
    'هل صيانة الأصول مصروف إيرادي أم رأسمالي IAS 16؟',
    'كيف يتم تقييم هبوط أسعار المخزون IAS 2؟',
    'كيف نحسب الخسائر الائتمانية المتوقعة IFRS 9؟'
  ];

  const handleResetChat = () => {
    setMessages([{ ...initialMessage, id: Date.now() }]);
  };

  const sendMessageWithText = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = `بناءً على تحليل البيانات المالية الحالية لـ ERP، بالنسبة لسؤالك عن "${textToSend}": يوصى بمراجعة المعالجة وفق المعايير الدولية (IAS/IFRS) والتحقق من أرصدة الأستاذ العام قبل اعتماد القيد النهائي.`;
      let actionObj;
      let snippetObj;

      const lowerText = textToSend.toLowerCase();
      const isConceptQuery = lowerText.includes('هدف') || lowerText.includes('ماهو') || lowerText.includes('ما هو') || lowerText.includes('تعريف') || lowerText.includes('مبدأ');

      if (lowerText.includes('ifrs 16') || lowerText.includes('إيجار') || lowerText.includes('ايجار')) {
        if (isConceptQuery) {
          aiResponseText = 'يهدف معيار IFRS 16 (عقود الإيجار) إلى ضمان تقديم المستأجرين والمؤجرين معلومات ملائمة تعبر بصدق عن تلك المعاملات. ويكمن الهدف الأساسي في إنهاء المعالجة الحسابية خارج الميزانية (Off-Balance Sheet) للإيجارات التشغيلية، وإلزام المستأجر بإثبات جميع العقود في الميزانية كأصل حق استخدام (ROU) والتزام إيجار لتعزيز الشفافية والرقابة المالية.';
          snippetObj = undefined;
        } else {
          aiResponseText = 'وفقاً لمعيار IFRS 16 (عقود الإيجار)، يتم إثبات أصل حق الاستخدام (ROU Asset) مقابل الالتزام الإيجاري مخصوماً بمعدل الفائدة الافتراضي، مع إهلاك الأصل عبر فترة العقد.';
          snippetObj = {
            debitAcc: 'أصول حق الاستخدام (ROU Assets)',
            creditAcc: 'التزامات عقود الإيجار طويلة الأجل',
            amount: 45000,
            statement: 'إثبات أصل والالتزام عقد الإيجار السنوي'
          };
          actionObj = { label: 'الانتقال لمحرك عقود IFRS 16', tabTarget: 'ifrs16' };
        }
      } 
      else if (lowerText.includes('ias 16') || lowerText.includes('صيانة') || lowerText.includes('صيانه') || lowerText.includes('أصول ثابتة') || lowerText.includes('أصل ثابت')) {
        if (isConceptQuery) {
          aiResponseText = 'يهدف معيار IAS 16 إلى تحديد المعالجة المحاسبية للممتلكات والآلات والمعدات بحيث يتمكن مستخدمو القوائم المالية من التعرف على المعلومات المتعلقة باستثمارات المنشأة في أصولها الثابتة والتغيرات في هذه الاستثمارات.';
          snippetObj = undefined;
        } else {
          aiResponseText = 'وفقاً لمعيار IAS 16 (الممتلكات والآلات والمعدات)، فإن مصروفات الصيانة الدورية تُحمل على قائمة الدخل فوراً كمصروف إيرادي، أما المصروفات الجذرية التي تزيد العمر التشغيلي أو الطاقة الإنتاجية فترسمل على تكلفة الأصل.';
          snippetObj = {
            debitAcc: 'الأصول الثابتة (معدات وآلات)',
            creditAcc: 'حساب المصروفات العمومية (صيانة)',
            amount: 7500,
            statement: 'إعادة تصنيف صيانة جذرية مسجلة خطأ كمصروف'
          };
          actionObj = { label: 'عرض القيد في محرك التعديلات', tabTarget: 'adjustments' };
        }
      } 
      else if (lowerText.includes('مخزون') || lowerText.includes('ias 2')) {
        if (isConceptQuery) {
          aiResponseText = 'يهدف معيار IAS 2 إلى وصف المعالجة المحاسبية للمخزون، والقضية الأساسية فيه هي تحديد مقدار التكلفة التي يُعترف بها كأصل وتُرحل حتى يُعترف بالإيرادات المتعلقة بها.';
          snippetObj = undefined;
        } else {
          aiResponseText = 'وفقاً لمعيار IAS 2 (المخزون)، يُقيّم المخزون بالتكلفة أو صافي القيمة القابلة للتحقق (NRV) أيهما أقل، مع ضرورة تكوين مخصص هبوط أسعار المخزون الراكد.';
          snippetObj = {
            debitAcc: 'مصروف هبوط مخزون (أرباح وخسائر)',
            creditAcc: 'مخصص هبوط أسعار المخزون',
            amount: 18500,
            statement: 'تكوين مخصص هبوط مخزون راكد للفترة'
          };
        }
      }
      else if (lowerText.includes('ifrs 9') || lowerText.includes('ائتمان') || lowerText.includes('عملاء') || lowerText.includes('مخصص')) {
        aiResponseText = 'وفقاً لمعيار IFRS 9 (الأدوات المالية)، يتم حساب مخصص الخسائر الائتمانية المتوقعة (ECL) استناداً إلى مصفوفة التعثر التاريخية والمؤشرات المستقبلية للعملاء.';
      }

      const newAiMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: actionObj,
        journalEntrySnippet: snippetObj
      };

      setMessages(prev => [...prev, newAiMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageWithText(inputMessage);
  };

  return (
    <div className="flex flex-col h-[75vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-xl p-5 font-sans" dir="rtl">
      {/* رأس الشاشة */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-amber-400">المستشار المالي الذكي والتفاعلي (CFO AI Assistant)</h2>
          <p className="text-xs text-slate-400">محادثة حرة ومباشرة لتحليل القوائم المالية، القيود المحاسبية، وتطبيق معايير IFRS.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetChat}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] px-3 py-1.5 rounded-xl font-bold transition"
          >
            🔄 محادثة جديدة
          </button>
          <button
            onClick={() => alert('تم حفظ وتصدير جلسة المحادثة والتوصيات المالية بنجاح')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] px-3 py-1.5 rounded-xl font-bold transition"
          >
            📄 تصدير التوصيات
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
            متصل بقاعدة ERP النشطة
          </span>
        </div>
      </div>

      {/* صندوق المحادثة */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed flex flex-col gap-2 shadow ${
              msg.sender === 'user'
                ? 'bg-amber-600 text-white self-end rounded-tl-none'
                : 'bg-slate-900 text-slate-200 border border-slate-800 self-start rounded-tr-none'
            }`}
          >
            <div className="flex justify-between items-center gap-4 text-[10px] opacity-75 border-b border-white/10 pb-1">
              <span>{msg.sender === 'user' ? 'المحاسب (أبو أسامة)' : 'المستشار الذكي CFO AI'}</span>
              <span>{msg.timestamp}</span>
            </div>

            <p>{msg.text}</p>

            {/* عرض القيد فقط عند وجوده في النتيجة */}
            {msg.journalEntrySnippet && (
              <div className="bg-slate-950/80 border border-amber-500/30 p-3 rounded-xl mt-1 flex flex-col gap-1.5 font-mono text-[11px]">
                <div className="text-amber-400 font-bold text-[10px]">📋 القيد المحاسبي الموصى به:</div>
                <div className="flex justify-between text-emerald-400">
                  <span>من ح/ {msg.journalEntrySnippet.debitAcc}</span>
                  <span>${msg.journalEntrySnippet.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-400">
                  <span>إلى ح/ {msg.journalEntrySnippet.creditAcc}</span>
                  <span>${msg.journalEntrySnippet.amount.toLocaleString()}</span>
                </div>
                <div className="text-[10px] text-slate-400 italic mt-0.5">البيان: {msg.journalEntrySnippet.statement}</div>
                <button
                  onClick={() => alert(`تم ترحيل القيد بقيمة $${msg.journalEntrySnippet?.amount.toLocaleString()} مباشرة إلى نظام الـ ERP بنجاح.`)}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] py-1 px-3 rounded-lg font-bold transition text-center"
                >
                  🚀 ترحيل القيد آلياً إلى ERP
                </button>
              </div>
            )}

            {msg.suggestedAction && (
              <button
                onClick={() => alert(`سيتم توجيهك إلى شاشة (${msg.suggestedAction?.label})`)}
                className="mt-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] px-3 py-1.5 rounded-lg font-bold transition text-right w-fit"
              >
                🔗 {msg.suggestedAction.label}
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="bg-slate-900 text-amber-400 border border-slate-800 p-3 rounded-2xl self-start text-xs animate-pulse">
            جاري تحليل البيانات واستنباط التوصية المحاسبية...
          </div>
        )}
      </div>

      {/* شريط الأسئلة السريعة */}
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        <span className="text-[10px] text-slate-400 whitespace-nowrap">أسئلة شائعة:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessageWithText(q)}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[10px] px-3 py-1 rounded-full whitespace-nowrap transition"
          >
            {q}
          </button>
        ))}
      </div>

      {/* حقل الإدخال الحر */}
      <form onSubmit={handleFormSubmit} className="mt-1 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="اكتب سؤالك أو استفسارك المالي هنا..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
        >
          <span>إرسال الاستفسار</span>
        </button>
      </form>
    </div>
  );
}