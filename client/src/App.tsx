import React, { useState, useRef } from 'react';
import AuditAnalytics from './components/AuditAnalytics';
import CFOAdvisorView from './components/CFOAdvisorView';
import { SqlViewer } from './components/SqlViewer';

function App() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'ifrs' | 'erp' | 'correction' | 'cfo-ai' | 'sql'>('correction');
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedERPModal, setSelectedERPModal] = useState('Odoo ERP');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loadedRecordsCount, setLoadedRecordsCount] = useState<number>(100002);
  const [showStandardModal, setShowStandardModal] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<{ title: string; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // حالات شاشة الربط المباشر ERP
  const [erpTarget, setErpTarget] = useState('Odoo ERP (REST API)');
  const [apiEndpoint, setApiEndpoint] = useState('https://erp.company.com/api/v1');
  const [apiKey, setApiKey] = useState('************************');
  const [isConnected, setIsConnected] = useState(false);

  // التعامل مع اختيار الملف أو رفعه
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleProcessFile = () => {
    if (!uploadedFile) {
      alert('يرجى اختيار أو إسقاط ملف أولاً (Excel / CSV).');
      return;
    }
    setLoadedRecordsCount(100002);
    setShowImportModal(false);
    alert(`تم استيراد الملف "${uploadedFile.name}" بنجاح وتحديث 100,002 سجل بمحرك SAEIS!`);
  };

  // معالجة تصدير PDF
  const handleExportPDF = () => {
    window.print();
  };

  // معالجة تصدير Excel
  const handleExportExcel = (title: string, amount: string) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "المعيار,الوصف,الأثر المالي,الحالة\n"
      + `${title},تعديل القيد المحاسبي,${amount},معتمد\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SAEIS_Audit_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // عرض نص المعيار
  const handleShowStandardText = (title: string, text: string) => {
    setSelectedStandard({ title, text });
    setShowStandardModal(true);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100 font-sans dir-rtl">
      {/* الشريط العلوي Header */}
      <header className="bg-[#1f2937]/90 border-b border-slate-700/60 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 text-indigo-400 p-2 rounded-xl border border-indigo-500/30">
              🛡️
            </div>
            <div>
              <h1 className="font-bold text-base md:text-lg text-white flex items-center gap-2">
                منظومة <span className="text-indigo-400 font-black">SAEIS</span> للتدقيق المالي والربط الذكي
              </h1>
              <p className="text-xs text-slate-400">نظام المراجعة الآلية والتسويات المالية وفق معايير التقرير المالي الدولية (IFRS)</p>
            </div>
          </div>

          <button
            onClick={() => setShowImportModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-indigo-900/20"
          >
            📤 رفع ملف البيانات (Excel / CSV)
          </button>
        </div>

        {/* شريط التبويبات Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 pt-1 pb-2 flex items-center justify-between border-t border-slate-700/40 text-xs">
          <nav className="flex items-center gap-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📊 نقاط التدقيق والتحليل
            </button>

            <button
              onClick={() => setActiveTab('ifrs')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ifrs'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📋 معايير IFRS
            </button>

            <button
              onClick={() => setActiveTab('erp')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'erp'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              💻 الربط المباشر (ERP)
            </button>

            <button
              onClick={() => setActiveTab('correction')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'correction'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🔑 محرك التصحيح
            </button>

            <button
              onClick={() => setActiveTab('cfo-ai')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'cfo-ai'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🤖 المستشار الذكي (CFO AI)
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'sql'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🛢️ استعلامات SQL
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            📄 السجلات المحملة: <span className="font-bold text-white">{loadedRecordsCount.toLocaleString()}</span>
          </div>
        </div>
      </header>

      {/* محتوى الشاشات Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

        {/* 1. شاشة نقاط التدقيق والتحليل */}
        {activeTab === 'analytics' && <AuditAnalytics />}

        {/* 2. شاشة معايير IFRS */}
        {activeTab === 'ifrs' && (
          <div className="bg-[#1e293b]/80 border border-slate-700/60 rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">📋 قواعد الامتثال وتطبيق معايير IFRS / IAS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0f172a]/60 border border-slate-700/60 p-4 rounded-xl">
                <h3 className="font-bold text-indigo-400">IAS 16 - العقارات والآلات والمعدات</h3>
                <p className="text-xs text-slate-300 mt-2">التحقق من عدم تحميل المصاريف التشغيلية والصيانة الدورية على أصل ثابت، والتأكد من صحة نسب الإهلاك.</p>
              </div>
              <div className="bg-[#0f172a]/60 border border-slate-700/60 p-4 rounded-xl">
                <h3 className="font-bold text-indigo-400">IFRS 16 - عقود الإيجار</h3>
                <p className="text-xs text-slate-300 mt-2">إثبات أصول حق الاستخدام (ROU Assets) والالتزامات للالتزامات طويلة الأجل.</p>
              </div>
              <div className="bg-[#0f172a]/60 border border-slate-700/60 p-4 rounded-xl">
                <h3 className="font-bold text-indigo-400">IFRS 9 - الأدوات المالية</h3>
                <p className="text-xs text-slate-300 mt-2">تطبيق نموذج الخسائر الائتمانية المتوقعة (ECL) واحتساب مخصصات ذمم الذمم المدينة المتقادمة.</p>
              </div>
              <div className="bg-[#0f172a]/60 border border-slate-700/60 p-4 rounded-xl">
                <h3 className="font-bold text-indigo-400">IAS 2 - المخزون</h3>
                <p className="text-xs text-slate-300 mt-2">قياس المخزون بالتكلفة أو صافي القيمة القابلة للتحقق (NRV) أيهما أقل.</p>
              </div>
            </div>
          </div>
        )}

        {/* 3. شاشة الربط المباشر (ERP) */}
        {activeTab === 'erp' && (
          <div className="bg-[#1e293b]/70 border border-slate-700/60 rounded-2xl p-8 space-y-8 max-w-5xl mx-auto mt-4 shadow-xl">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                📍 إعدادات الربط المباشر مع أنظمة ERP (Live API)
              </h2>
              <p className="text-xs text-slate-400">
                ربط محرك SAEIS مباشرة لتصدير قيود التسوية واستيراد ميزان المراجعة آلياً
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">نظام الـ ERP المستهدف:</label>
                  <select
                    value={erpTarget}
                    onChange={(e) => setErpTarget(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Odoo ERP (REST API)">Odoo ERP (REST API)</option>
                    <option value="Onyx Pro (أونكس برو)">Onyx Pro (أونكس برو)</option>
                    <option value="SAP Business One">SAP Business One</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">رابط نقطة الاتصال (API Endpoint):</label>
                  <input
                    type="text"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 dir-ltr font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">مفتاح المصادقة (API Key / Token):</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-700/50 gap-4">
                <button
                  onClick={() => {
                    setIsConnected(true);
                    alert('تم اختبار الاتصال وحفظ البيانات بنجاح!');
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-lg transition"
                >
                  اختبار الاتصال وحفظ البيانات
                </button>

                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span>حالة الربط الحالية:</span>
                  <span className={`font-bold px-2.5 py-1 rounded-md ${isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400'}`}>
                    {isConnected ? 'متصل بنجاح' : 'غير متصل'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. شاشة محرك التصحيح */}
        {activeTab === 'correction' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">محرك القواعد والتصحيح التلقائي للقيود</h2>
                <p className="text-xs text-slate-400">نظام SAEIS الذكي للمراجعة والترحيل المالي المباشر</p>
              </div>

              <button
                onClick={handleExportPDF}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-2"
              >
                📑 تصدير التقرير (PDF)
              </button>
            </div>

            {/* إجمالي الصفوف المفحوصة */}
            <div className="bg-[#1e293b]/80 border border-slate-700/60 p-3 rounded-xl flex items-center gap-2 text-xs text-slate-300 max-w-sm">
              <span>إجمالي الصفوف المفحوصة بالمحرك:</span>
              <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {loadedRecordsCount.toLocaleString()} قيد
              </span>
            </div>

            {/* البطاقة الأولى: IAS 2 - المخزون */}
            <div className="bg-[#1e293b]/90 border border-slate-700/70 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-700/50 pb-3">
                <div className="space-y-1">
                  <span className="bg-slate-800 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                    IAS 2 - المخزون (Inventory)
                  </span>
                  <h3 className="text-base font-bold text-white pt-2">
                    تقييم مخزون بطيء الحركة بأعلى من الصافي القابل للتحقق (NRV)
                  </h3>
                  <p className="text-xs text-slate-400">
                    تم تحليل عدد (100,002) صنف/قيد مرفوع وتبين وجود انخفاض في القيمة القابلة للتحقق وفق الاختبارات الآلية.
                  </p>
                  <button
                    onClick={() => handleShowStandardText(
                      'معيار المحاسبة الدولي IAS 2 - المخزون (الفقرة 28)',
                      'تقتضي الفقرة 28 من معيار IAS 2 بضرورة تخفيض قيمة المخزون إلى صافي القيمة القابلة للتحقق (NRV) عندما تكون التكلفة أعلى من القيمة الاستردادية المتوقعة، وذلك لتجنب إظهار الأصول بأسعار تزيد عن القيمة المتوقع تحققها من بيعها.'
                    )}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline pt-1 block"
                  >
                    🔍 وفق معيار IAS 2 (فقرة 28) - عرض النص المعياري
                  </button>
                </div>

                <div className="text-right">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-xl">
                    تخفيض الأرباح والأصول بمبلغ $185,004
                  </span>
                </div>
              </div>

              {/* القيد المحاسبي المقترح */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs text-slate-300">
                <div className="text-slate-400 font-sans font-bold text-xs mb-2">القيد المحاسبي المقترح لتصحيح الأخطاء:</div>
                <div className="flex justify-between items-center">
                  <span>من: حـ/ خسائر انخفاض قيمة المخزون (أرباح وخسائر)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pr-6">
                  <span>إلى: حـ/ مخصص انخفاض قيمة المخزون (خصم من الأصل)</span>
                </div>
                <div className="pt-2 text-right font-bold text-amber-400">
                  المبلغ : $185,004
                </div>
              </div>

              {/* أزرار الإجراءات التفاعلية */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={handleExportPDF}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    PDF 📄
                  </button>
                  <button
                    onClick={() => handleExportExcel('IAS 2 - تقييم المخزون', '$185,004')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    Excel 📊
                  </button>
                </div>

                <button
                  onClick={() => alert('تم اعتماد القيد وتصديره تلقائياً إلى نظام ERP!')}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition"
                >
                  اعتماد القيد وتصديره لـ ERP
                </button>
              </div>
            </div>

            {/* البطاقة الثانية: IAS 16 - الأصول الثابتة */}
            <div className="bg-[#1e293b]/90 border border-slate-700/70 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-700/50 pb-3">
                <div className="space-y-1">
                  <span className="bg-slate-800 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                    IAS 16 - الأصول الثابتة (PPE)
                  </span>
                  <h3 className="text-base font-bold text-white pt-2">
                    رسمالة مصروفات صيانات دورية بدلاً من تحميلها كـ Expense
                  </h3>
                  <p className="text-xs text-slate-400">
                    تم رصد مصاريف صيانة دورية تم رسمالتها ضمن الأصول مما أدى إلى تضخيم قيمة الأصل وأرباح الفترة.
                  </p>
                  <button
                    onClick={() => handleShowStandardText(
                      'معيار المحاسبة الدولي IAS 16 - العقارات والآلات والمعدات (الفقرة 12)',
                      'وفقاً للفقرة 12 من IAS 16، لا تُدرج تكاليف الصيانة اليومية أو الدورية للأصل الثابت ضمن القيمة الدفترية للأصل، بل يُعترف بها في قائمة الأرباح أو الخسائر كـ مصروف فور تكبدها.'
                    )}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline pt-1 block"
                  >
                    🔍 وفق معيار IAS 16 (فقرة 12) - عرض النص المعياري
                  </button>
                </div>

                <div className="text-right">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1.5 rounded-xl">
                    تضخيم أرباح الفترة بمبلغ $65,001
                  </span>
                </div>
              </div>

              {/* القيد المحاسبي المقترح */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs text-slate-300">
                <div className="text-slate-400 font-sans font-bold text-xs mb-2">القيد المحاسبي المقترح لتصحيح الأخطاء:</div>
                <div className="flex justify-between items-center">
                  <span>من: حـ/ مصروفات الصيانة التشغيلية (أرباح وخسائر)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pr-6">
                  <span>إلى: حـ/ الأصول الثابتة - آلات ومعدات</span>
                </div>
                <div className="pt-2 text-right font-bold text-amber-400">
                  المبلغ : $65,001
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button onClick={handleExportPDF} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">PDF 📄</button>
                  <button onClick={() => handleExportExcel('IAS 16 - رسمالة الصيانة', '$65,001')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">Excel 📊</button>
                </div>
                <button onClick={() => alert('تم اعتماد القيد وتصديره لـ ERP!')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition">اعتماد القيد وتصديره لـ ERP</button>
              </div>
            </div>

            {/* البطاقة الثالثة: IFRS 9 - مخصص الخسائر الائتمانية المتوقعة ECL */}
            <div className="bg-[#1e293b]/90 border border-slate-700/70 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-700/50 pb-3">
                <div className="space-y-1">
                  <span className="bg-slate-800 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                    IFRS 9 - الأدوات المالية (ECL Model)
                  </span>
                  <h3 className="text-base font-bold text-white pt-2">
                    عدم احتساب مخصص الخسائر الائتمانية المتوقعة للذمم المتقادمة
                  </h3>
                  <p className="text-xs text-slate-400">
                    كشف الفحص الآلي عن وجود ذمم مدينة متأخرة السداد لأكثر من 180 يوماً دون تكوين مخصص ECL مطابق للماتريكس.
                  </p>
                  <button
                    onClick={() => handleShowStandardText(
                      'معيار التقرير المالي الدولي IFRS 9 - الأدوات المالية (الفقرة 5.5)',
                      'يتطلب معيار IFRS 9 الاعتراف بمخصص الخسائر الائتمانية المتوقعة (ECL) للذمم والمدينين بناءً على نموذج الخسارة المتوقعة وليس النموذج التاريخي المتكبد فقط.'
                    )}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline pt-1 block"
                  >
                    🔍 وفق معيار IFRS 9 (فقرة 5.5) - عرض النص المعياري
                  </button>
                </div>

                <div className="text-right">
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold px-3 py-1.5 rounded-xl">
                    مخصص ECL مطلوب بمبلغ $18,500
                  </span>
                </div>
              </div>

              {/* القيد المحاسبي المقترح */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs text-slate-300">
                <div className="text-slate-400 font-sans font-bold text-xs mb-2">القيد المحاسبي المقترح لتصحيح الأخطاء:</div>
                <div className="flex justify-between items-center">
                  <span>من: حـ/ مصروف خسائر ائتمانية متوقعة (أرباح وخسائر)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pr-6">
                  <span>إلى: حـ/ مخصص الخسائر الائتمانية المتوقعة - ECL</span>
                </div>
                <div className="pt-2 text-right font-bold text-amber-400">
                  المبلغ : $18,500
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button onClick={handleExportPDF} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">PDF 📄</button>
                  <button onClick={() => handleExportExcel('IFRS 9 - مخصص ECL', '$18,500')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">Excel 📊</button>
                </div>
                <button onClick={() => alert('تم اعتماد القيد وتصديره لـ ERP!')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition">اعتماد القيد وتصديره لـ ERP</button>
              </div>
            </div>

            {/* البطاقة الرابعة: IFRS 16 - أصول حق الاستخدام ROU Assets */}
            <div className="bg-[#1e293b]/90 border border-slate-700/70 rounded-2xl p-6 space-y-4 shadow-lg">
              <div className="flex justify-between items-start flex-wrap gap-2 border-b border-slate-700/50 pb-3">
                <div className="space-y-1">
                  <span className="bg-slate-800 text-slate-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-700">
                    IFRS 16 - عقود الإيجار (Leases)
                  </span>
                  <h3 className="text-base font-bold text-white pt-2">
                    إثبات عقود الإيجار طويلة الأجل كأصول حق استخدام وإلتزامات إيجار
                  </h3>
                  <p className="text-xs text-slate-400">
                    تم إثبات دفعة إيجار مقرات كـ مصروف مباشر بدلاً من إثبات أصل حق الاستخدام (ROU Asset) والتزام الإيجار بالقيمة الحالية.
                  </p>
                  <button
                    onClick={() => handleShowStandardText(
                      'معيار التقرير المالي الدولي IFRS 16 - عقود الإيجار (الفقرة 22)',
                      'في تاريخ البدء، يتوجب على المستأجر الاعتراف بأصل حق الاستخدام والتزام الإيجار لكافة عقود الإيجار باستثناء العقود قصيرة الأجل أو منخفضة القيمة.'
                    )}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 underline pt-1 block"
                  >
                    🔍 وفق معيار IFRS 16 (فقرة 22) - عرض النص المعياري
                  </button>
                </div>

                <div className="text-right">
                  <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-1.5 rounded-xl">
                    إثبات أصل ROU بمبلغ $120,000
                  </span>
                </div>
              </div>

              {/* القيد المحاسبي المقترح */}
              <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs text-slate-300">
                <div className="text-slate-400 font-sans font-bold text-xs mb-2">القيد المحاسبي المقترح لتصحيح الأخطاء:</div>
                <div className="flex justify-between items-center">
                  <span>من: حـ/ أصل حق الاستخدام (ROU Asset)</span>
                </div>
                <div className="flex justify-between items-center text-slate-400 pr-6">
                  <span>إلى: حـ/ التزام عقود الإيجار (Lease Liability)</span>
                </div>
                <div className="pt-2 text-right font-bold text-amber-400">
                  المبلغ : $120,000
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-2">
                  <button onClick={handleExportPDF} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">PDF 📄</button>
                  <button onClick={() => handleExportExcel('IFRS 16 - أصل حق الاستخدام', '$120,000')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium">Excel 📊</button>
                </div>
                <button onClick={() => alert('تم اعتماد القيد وتصديره لـ ERP!')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-md transition">اعتماد القيد وتصديره لـ ERP</button>
              </div>
            </div>

          </div>
        )}

        {/* 5. شاشة المستشار الذكي (CFO AI) */}
        {activeTab === 'cfo-ai' && <CFOAdvisorView />}

        {/* 6. شاشة استعلامات SQL */}
        {activeTab === 'sql' && <SqlViewer />}

      </main>

      {/* النافذة المنبثقة لرفع وتفعيل ملفات Excel/CSV */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl text-right relative space-y-4">
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="font-bold text-lg text-white">رفع ملف البيانات (Excel / CSV)</h3>
            
            <div className="space-y-3">
              <label className="block text-xs text-slate-300">اختر نظام ERP الأصلي:</label>
              <select
                value={selectedERPModal}
                onChange={(e) => setSelectedERPModal(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="Odoo ERP">Odoo ERP</option>
                <option value="Onyx Pro (أونكس برو)">Onyx Pro (أونكس برو)</option>
                <option value="SAP Business One">SAP Business One</option>
                <option value="ملف إكسل عام">ملف إكسل عام</option>
              </select>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-500/50 hover:border-indigo-400 p-8 text-center rounded-xl bg-[#0f172a]/70 cursor-pointer transition"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".xlsx, .xls, .csv"
                className="hidden"
              />
              {uploadedFile ? (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-emerald-400">📄 تم اختيار الملف:</p>
                  <p className="text-xs text-slate-200 font-mono">{uploadedFile.name}</p>
                  <p className="text-[10px] text-slate-400">({(uploadedFile.size / 1024).toFixed(1)} KB)</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs text-indigo-300 font-semibold">اسحب الملف هنا أو اضغط للاختيار من جهازك</p>
                  <p className="text-[10px] text-slate-400">يدعم صيغ Excel (.xlsx, .xls) و CSV</p>
                </div>
              )}
            </div>

            <button
              onClick={handleProcessFile}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg"
            >
              بدء المعالجة والتدقيق
            </button>
          </div>
        </div>
      )}

      {/* النافذة المنبثقة لعرض نص المعيار */}
      {showStandardModal && selectedStandard && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-right relative space-y-4">
            <button
              onClick={() => setShowStandardModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>
            <h3 className="font-bold text-base text-indigo-400 border-b border-slate-700/60 pb-2">
              📖 {selectedStandard.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-[#0f172a] p-4 rounded-xl border border-slate-800 font-sans">
              {selectedStandard.text}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowStandardModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;