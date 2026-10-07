import React, { useState } from 'react';

import AuditAnalytics from './components/AuditAnalytics';
import CorrectionEngine from './components/CorrectionEngine';
import AuditRulesIFRS from './components/AuditRulesIFRS';
import SqlViewer from './components/SqlViewer';
import CreditScoringComponent from './components/creditScoringComponet';
import CfoAdvisorView from './components/CfoAdvisorView';
interface StandardItem {
  code: string;
  title: string;
  category: string;
  description: string;
  sqlView: string;
  status: string;
  complianceRate: string;
}

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ErpAsset {
  ItemCode: number;
  ItemName: string;
  AcquisitionCost: number;
  AccumulatedDepreciation: number;
  UsefulLifeYears: number;
  AccountType: string;
}

interface AdjustmentEntry {
  id: number;
  standard: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'معلق' | 'تم الترحيل للـ ERP';
}

interface FraudAnomalyItem {
  id: number;
  entryNumber: string;
  riskType: string;
  amount: number;
  reason: string;
  riskLevel: 'عالي' | 'متوسط';
}

interface RealTimeAlert {
  id: number;
  title: string;
  standard: string;
  severity: 'حرج' | 'تحذير' | 'معلومة';
  timestamp: string;
  message: string;
}

interface CashFlowMonth {
  month: string;
  receivables: number;
  payables: number;
  netCashFlow: number;
  status: 'آمن' | 'عجز محتمل';
}

interface AuditorProfile {
  id: number;
  name: string;
  firm: string;
  specialty: string;
  rating: number;
  completedAudits: number;
  status: 'متاح الآن' | 'مشغول حالياً';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('analytics');

  // متغيرات وحالات المحاكي المالي والزكوي
  const [discountRate, setDiscountRate] = useState<number>(10);
  const [zakatRate, setZakatRate] = useState<number>(2.5);
  const [vatRate, setVatRate] = useState<number>(15);
  const [inventoryProvision, setInventoryProvision] = useState<number>(185004);
  const [collectionDelayDays, setCollectionDelayDays] = useState<number>(30);

  const baseRevenue = 1250000;
  const adjustedNetProfit = baseRevenue - inventoryProvision;
  const calculatedZakat = (adjustedNetProfit * (zakatRate / 100)).toFixed(2);
  const calculatedVat = (baseRevenue * (vatRate / 100)).toFixed(2);
  const netAfterZakat = (adjustedNetProfit - Number(calculatedZakat)).toFixed(2);

  // حالات نافذة رفع ملفات الـ ERP المنبثقة
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [modalErpSystem, setModalErpSystem] = useState<string>('Odoo ERP');
  const [selectedFileName, setSelectedFileName] = useState<string>('SAEIS_GlobalCo_25000_Accounts_ForUpload.xlsx');

  // حالات شاشة المستشار الذكي CFO AI
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'أهلاً بك يا أسامة. أنا المستشار المالي الذكي (CFO AI) لمنظومة SAEIS. سوق المدققين المستقلين ووحدات التدقيق المتقدمة جاهزة بالكامل. كيف يمكنني مساعدتك اليوم؟' }
  ]);

  // حالات شاشة الربط المباشر ERP
  const [selectedErpSystem, setSelectedErpSystem] = useState<string>('Odoo ERP (REST API)');
  const [apiKey, setApiKey] = useState<string>('sk_live_99f8d7b6c5a43210');
  const [apiEndpoint, setApiEndpoint] = useState<string>('https://erp.company.com/api/v1');
  const [connectionStatus, setConnectionStatus] = useState<string>('غير متصل');

  const [selectedStandard, setSelectedStandard] = useState<string>('IAS16');

  // قيود التسوية الآلية
  const [adjustmentEntries, setAdjustmentEntries] = useState<AdjustmentEntry[]>([
    { id: 1, standard: 'IAS 16', description: 'إعادة تصنيف أصل أدوات مكتبية استهلاكية مسجلة خطأ كمصروفات', debitAccount: 'الأصول الثابتة (معدات)', creditAccount: 'حساب المصروفات العمومية', amount: 750, status: 'معلق' },
    { id: 2, standard: 'IAS 2', description: 'إثبات مخصص هبوط أسعار المخزون الراكد للفترة الحالية', debitAccount: 'مصروف مخصص هبوط مخزون', creditAccount: 'مخصص هبوط مخزون (مخاطر)', amount: 185004, status: 'معلق' },
    { id: 3, standard: 'IFRS 16', description: 'إثبات أصل حق الاستخدام والتزام الإيجار السنوي المخصوم', debitAccount: 'أصول حق الاستخدام (عقارات)', creditAccount: 'التزامات عقود الإيجار طويلة الأجل', amount: 45000, status: 'معلق' }
  ]);

  // عينة اكتشاف الاحتيال والشذوذ
  const [fraudAnomalies, setFraudAnomalies] = useState<FraudAnomalyItem[]>([
    { id: 101, entryNumber: 'JE-2026-9012', riskType: 'فواتير مجزأة لتفادي الصلاحيات', amount: 4900, reason: 'إصدار 3 فواتير متتالية بقيمة أقل بقليل من حد اعتماد المدير المالي (5,000)', riskLevel: 'عالي' },
    { id: 102, entryNumber: 'JE-2026-8834', riskType: 'قيد مدخل خارج أوقات الدوام الرسمي', amount: 18500, reason: 'تم ترحيل القيد المحاسبي في الساعة 2:30 صباحاً يوم جمعة بواسطة مستخدم فرعي', riskLevel: 'متوسط' },
    { id: 103, entryNumber: 'JE-2026-7721', riskType: 'تكرار بند مصروفات متطابق', amount: 1200, reason: 'وجود قيدين بنفس القيمة والبيان لنفس المورد خلال أقل من 24 ساعة', riskLevel: 'عالي' }
  ]);

  // قائمة التنبيهات الفورية الذكية
  const [realTimeAlerts, setRealTimeAlerts] = useState<RealTimeAlert[]>([
    { id: 1, title: 'تجاوز حد رسملة الأصول', standard: 'IAS 16', severity: 'حرج', timestamp: 'منذ 5 دقائق', message: 'تم رصد بند بقيمة 750$ مصنف كمصروفات صيانة بينما يتجاوز الحد الأدنى للرسملة.' },
    { id: 2, title: 'انحراف تقييم المخزون', standard: 'IAS 2', severity: 'تحذير', timestamp: 'منذ 25 دقيقة', message: 'تم الكشف عن أصناف راكدة تتطلب تكوين مخصص هبوط بـ 185,004$.' },
    { id: 3, title: 'محاولة تجزئة فواتير مشبوهة', standard: 'Anomaly ML', severity: 'حرج', timestamp: 'منذ ساعة', message: 'رصد نظام التعلم الآلي 3 فواتير متتالية بقيم متطابقة لتفادي صلاحيات الاعتماد.' },
    { id: 4, title: 'تنبؤ عجز نقدي محتمل', standard: 'CashFlow AI', severity: 'تحذير', timestamp: 'منذ ساعتين', message: 'تتوقع النماذج التحليلية ضغط سيولة محتمل في شهر نوفمبر بناءً على تأخر التحصيل.' }
  ]);

  // بيانات التدفقات النقدية التنبؤية
  const cashFlowForecast: CashFlowMonth[] = [
    { month: 'أكتوبر 2026', receivables: 320000 - (collectionDelayDays * 500), payables: 240000, netCashFlow: (320000 - (collectionDelayDays * 500)) - 240000, status: 'آمن' },
    { month: 'نوفمبر 2026', receivables: 280000 - (collectionDelayDays * 800), payables: 310000, netCashFlow: (280000 - (collectionDelayDays * 800)) - 310000, status: 'عجز محتمل' },
    { month: 'ديسمبر 2026', receivables: 450000 - (collectionDelayDays * 400), payables: 350000, netCashFlow: (450000 - (collectionDelayDays * 400)) - 350000, status: 'آمن' },
    { month: 'يناير 2027', receivables: 290000 - (collectionDelayDays * 600), payables: 320000, netCashFlow: (290000 - (collectionDelayDays * 600)) - 320000, status: 'عجز محتمل' }
  ];

  // بيانات سوق المدققين المستقلين (Auditors Marketplace) الجديدة
  const [auditorsList, setAuditorsList] = useState<AuditorProfile[]>([
    { id: 1, name: 'د. عبدالله القحطاني', firm: 'مكتب الخبراء للاستشارات المحاسبية والتدقيق', specialty: 'معايير IFRS والزكاة والضريبة', rating: 4.9, completedAudits: 142, status: 'متاح الآن' },
    { id: 2, name: 'أ. مروان المخلافي', firm: 'شركة الميزان للتدقيق المالي', specialty: 'ERP Integration & Internal Audit', rating: 4.8, completedAudits: 98, status: 'متاح الآن' },
    { id: 3, name: 'م. سارة الصهباني', firm: 'مكتب الرقابة الذكية للمراجعة', specialty: 'Fraud Detection & Financial Compliance', rating: 4.9, completedAudits: 115, status: 'مشغول حالياً' },
    { id: 4, name: 'أ. فهد الشيباني', firm: 'مكتب التميز للمحاسبة والقوائم المالية', specialty: 'IAS 16, IFRS 16 & Valuations', rating: 4.7, completedAudits: 84, status: 'متاح الآن' }
  ]);

  const sampleErpAssets: ErpAsset[] = [
    { ItemCode: 201, ItemName: 'أجهزة سيرفرات مركزية', AcquisitionCost: 4500, AccumulatedDepreciation: 0, UsefulLifeYears: 4, AccountType: 'FixedAsset' },
    { ItemCode: 202, ItemName: 'شراء أدوات مكتبية استهلاكية', AcquisitionCost: 750, AccumulatedDepreciation: 0, UsefulLifeYears: 1, AccountType: 'Expense' },
    { ItemCode: 203, ItemName: 'سيارة نقل بضائع', AcquisitionCost: 22000, AccumulatedDepreciation: 1500, UsefulLifeYears: 5, AccountType: 'FixedAsset' }
  ];

  const ifrsStandardsData: Record<string, StandardItem> = {
    IAS1: {
      code: 'IAS 1',
      title: 'عرض القوائم المالية (Presentation of Financial Statements)',
      category: 'معايير العرض والأداء',
      description: 'توليد قائمة المركز المالي، قائمة الدخل، التغيرات في الحقوق، وقائمة التدفقات النقدية وفقاً للمعايير الدولية.',
      sqlView: 'CREATE VIEW vw_IAS1_FinancialPresentation AS SELECT StatementType, AccountCode, AccountName, Balance, Period FROM GeneralLedger WHERE Approved = 1;',
      status: 'مطابق ومفعل',
      complianceRate: '98%'
    },
    IAS2: {
      code: 'IAS 2',
      title: 'المخزون (Inventories)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'قياس المخزون بالتكلفة أو صافي القيمة القابلة للتحقق أيهما أقل، مع احتساب مخصصات الهبوط التلقائية.',
      sqlView: 'CREATE VIEW vw_IAS2_InventoryValuation AS SELECT ItemCode, ItemName, Cost, NetRealizableValue, (Cost - NetRealizableValue) AS ProvisionNeeded FROM Inventory WHERE Cost > NetRealizableValue;',
      status: 'تم فحص المخزون',
      complianceRate: '94%'
    },
    IAS16: {
      code: 'IAS 16',
      title: 'الممتلكات والآلات والمعدات (Property, Plant and Equipment)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'حساب الإهلاك المتراكم للأصول الثابتة، تقييم العمر الإنتاجي، ومعالجة إعادة التقييم.',
      sqlView: 'CREATE VIEW vw_IAS16_PPE_Depreciation AS SELECT AssetID, AssetName, AcquisitionCost, AccumulatedDepreciation, UsefulLifeYears FROM FixedAssets;',
      status: 'تدقيق نشط',
      complianceRate: '97%'
    },
    IAS36: {
      code: 'IAS 36',
      title: 'اضمحلال قيمة الأصول (Impairment of Assets)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'اختبارات الهبوط والانخفاض في القيمة عندما تزيد القيمة الدفترية للأصل عن قيمته القابلة للاسترداد.',
      sqlView: "CREATE VIEW vw_IAS36_ImpairmentCheck AS SELECT AssetID, CarryingAmount, RecoverableAmount, CASE WHEN CarryingAmount > RecoverableAmount THEN 'Impaired' ELSE 'Safe' END AS ImpairmentStatus FROM Assets;",
      status: 'مفعل',
      complianceRate: '99%'
    },
    IFRS9: {
      code: 'IFRS 9',
      title: 'الأدوات المالية (Financial Instruments - ECL)',
      category: 'الإيرادات والأدوات المالية',
      description: 'نموذج الخسائر الائتمانية المتوقعة (Expected Credit Loss) للعملاء والمدينين التجاريين.',
      sqlView: 'CREATE VIEW vw_IFRS9_ECL_Calculation AS SELECT CustomerID, TotalExposure, DaysOverdue, RiskRating, (TotalExposure * LossRate) AS ExpectedCreditLoss FROM Receivables;',
      status: 'تدقيق نشط',
      complianceRate: '95%'
    },
    IFRS15: {
      code: 'IFRS 15',
      title: 'الإيرادات من العقود مع العملاء (Revenue from Contracts)',
      category: 'الإيرادات والأدوات المالية',
      description: 'تطبيق نموذج الخطوات الخمس للاعتراف بالإيراد وتحديد التزامات الأداء للعملاء.',
      sqlView: 'CREATE VIEW vw_IFRS15_RevenueCheck AS SELECT ContractID, CustomerID, TransactionPrice, PerformanceObligationsMet, RecognizedRevenue FROM Contracts;',
      status: 'مفعل ومُراجع',
      complianceRate: '96%'
    },
    IFRS16: {
      code: 'IFRS 16',
      title: 'عقود الإيجار (Leases)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'معالجة أصول حق الاستخدام (Right-of-Use Assets) والالتزامات المرتبطة بها وخصم التدفقات.',
      sqlView: 'CREATE VIEW vw_IAS16_Leases AS SELECT LeaseID, LessorName, AnnualRent, LeaseTermYears, DiscountRate, (AnnualRent * PV_Factor) AS LeaseLiability FROM LeaseContracts;',
      status: 'مفعل',
      complianceRate: '93%'
    }
  };

  const currentStandard = ifrsStandardsData[selectedStandard] || ifrsStandardsData['IAS16'];

  const handleTestConnection = () => {
    setConnectionStatus('جاري الاتصال...');
    setTimeout(() => {
      setConnectionStatus('متصل بنجاح (API Active)');
    }, 1000);
  };

  const handlePushToErp = (id: number) => {
    setAdjustmentEntries(prev => 
      prev.map(entry => entry.id === id ? { ...entry, status: 'تم الترحيل للـ ERP' } : entry)
    );
    alert(`تم ترحيل قيد التسوية رقم (${id}) بنجاح إلى نظام الـ ERP المستهدف (${selectedErpSystem}) عبر الـ API!`);
  };

  const handleRequestAudit = (auditorName: string) => {
    alert(`تم إرسال طلب مراجعة وتدقيق عن بُعد بنجاح إلى المدقق (${auditorName}) عبر منصة SAEIS Marketplace! سيتم التواصل معك قريباً.`);
  };

  // دالة توليد وتصدير تقرير التدقيق بصيغة PDF
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بفتح النوافذ المنبثقة (Pop-ups) لتصدير التقرير.');
      return;
    }

    const reportHtml = `
      <html dir="rtl" lang="ar">
        <head>
          <meta charset="utf-8" />
          <title>تقرير التدقيق الشامل وسوق المدققين - منظومة SAEIS</title>
          <style>
            body { font-family: Tahoma, sans-serif; padding: 20px; color: #111; background: #fff; }
            .header { border-bottom: 2px solid #d97706; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 18px; font-weight: bold; color: #b45309; }
            .meta { font-size: 12px; color: #555; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; font-size: 12px; }
            th { background: #f1f5f9; color: #334155; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">منظومة SAEIS للتدقيق المالي والربط الذكي</div>
              <div class="meta">تقرير المنظومة الشامل وسوق المدققين المستقلين (Auditors Marketplace)</div>
            </div>
            <div class="meta">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</div>
          </div>

          <div class="box">
            <h3>ملخص الحالة المالية والرقابية</h3>
            <p><strong>مؤشر الامتثال لـ IFRS:</strong> 96.4%</p>
            <p><strong>عدد المدققين المتاحين في السوق:</strong> ${auditorsList.filter(a => a.status === 'متاح الآن').length} مكاتب معتمدة</p>
          </div>

          <h3>قائمة مكاتب التدقيق المستقلة المتاحة للربط عن بُعد</h3>
          <table>
            <thead>
              <tr>
                <th>اسم المدقق / الخبير</th>
                <th>المكتب المحاسبي</th>
                <th>التخصص الدقيق</th>
                <th>التقييم</th>
                <th>المهام المنجزة</th>
              </tr>
            </thead>
            <tbody>
              ${auditorsList.map(a => `
                <tr>
                  <td><b>${a.name}</b></td>
                  <td>${a.firm}</td>
                  <td>${a.specialty}</td>
                  <td>⭐ ${a.rating}</td>
                  <td>${a.completedAudits} تدقيق</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin-top: 40px; text-align: left; font-size: 12px; color: #64748b;">
            <p>تم استخراج هذا التقرير آلياً عبر محرك التدقيق الذكي لـ SAEIS</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // معالجة رسائل المساعد الذكي
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatMessage('');

    setTimeout(() => {
      let aiReply = '';
      const query = userText.toLowerCase();

      if (query.includes('مدقق') || query.includes('market') || query.includes('سوق') || query.includes('مكتب')) {
        aiReply = `[سوق المدققين]: لدينا ${auditorsList.filter(a => a.status === 'متاح الآن').length} مكاتب تدقيق مستقلة ومتاحة حالياً للمراجعة عن بُعد. يمكنك تصفحهم وطلب الخدمة من تبويب (سوق المدققين 🌐).`;
      } else if (query.includes('تدفق') || query.includes('سيولة')) {
        aiReply = `[المحرك التنبئي للسيولة]: هناك توقع بضغط نقدي محتمل في شهر نوفمبر. راجع تبويب التدفقات النقدية.`;
      } else {
        aiReply = "عذراً يا أسامة، يمكنك سؤالي عن: (سوق المدققين، التدفقات النقدية التنبؤية، التنبيهات الفورية، أو الزكاة والضرائب).";
      }

      setChatHistory(prev => [...prev, { sender: 'ai', text: aiReply }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col gap-6 relative" dir="rtl">
      {/* رأس المنظومة */}
      <header className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>منظومة SAEIS للتدقيق المالي والربط الذكي</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">المنصة المتكاملة لفحص القيود، تطبيق IFRS، والربط مع الأنظمة المالية</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportPDF}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
          >
            <span>تصدير تقرير التدقيق PDF 📄</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
          >
            <span>رفع ملف البيانات (Excel / CSV) 📁</span>
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
            حالة النظام: مستقر وفعال
          </span>
        </div>
      </header>

      {/* شريط التبويبات العلوي */}
      <nav className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'analytics' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          لوحة التحليلات 📊
        </button>

        <button
          onClick={() => setActiveTab('credit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'credit' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          📊 مُحرك التقييم الائتماني
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'marketplace' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          سوق المدققين 🌐
        </button>

        <button
          onClick={() => setActiveTab('cashflow')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'cashflow' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          التدفقات النقدية 📈
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'alerts' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          التنبيهات الفورية 🔔
        </button>

        <button
          onClick={() => setActiveTab('tax_fraud')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'tax_fraud' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          الضرائب والزكاة واحتيال الـ AI 🛡️
        </button>

        <button
          onClick={() => setActiveTab('adjustments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'adjustments' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          قيود التسوية الآلية ⚡
        </button>

        <button
          onClick={() => setActiveTab('ifrs_engine')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'ifrs_engine' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          محرك معايير IFRS الشامل 📖
        </button>

        <button
          onClick={() => setActiveTab('correction')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'correction' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          محرك التصحيح ⚙️
        </button>

        <button
          onClick={() => setActiveTab('ifrs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'ifrs' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          قواعد الفحص 🔍
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'sql' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          استعلامات SQL 🗄️
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'simulator' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          مُحاكي السيناريوهات 🚀
        </button>

        <button
          onClick={() => setActiveTab('erp')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'erp' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          الربط المباشر ERP 🔗
        </button>

        <button
          onClick={() => setActiveTab('cfo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'cfo' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          المستشار الذكي CFO AI
        </button>
      </nav>

      {/* عرض الشاشة النشطة */}
      <main className="flex-1">
        {activeTab === 'analytics' && <AuditAnalytics />}
        {activeTab === 'credit' && <CreditScoringComponent />}
        {activeTab === 'correction' && <CorrectionEngine />}
        {activeTab === 'cfo' && <CfoAdvisorView />}
        {/* شاشة سوق المدققين المستقلين الجديدة (Auditors Marketplace) */}
        {activeTab === 'marketplace' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">سوق إضافة المدققين المستقلين (Auditors Marketplace)</h2>
                <p className="text-xs text-slate-400">ربط مباشر بين الشركات ومكاتب المحاسبة المعتمدة لمراجعة السجلات والتقارير عن بُعد عبر المنصة</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● السوق متصل ومعتمد
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {auditorsList.map(auditor => (
                <div key={auditor.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-extrabold text-white">{auditor.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        auditor.status === 'متاح الآن' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {auditor.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-400">{auditor.firm}</span>
                    <p className="text-[10px] text-slate-400 mt-1">التخصص: {auditor.specialty}</p>
                  </div>

                  <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
                    <div className="flex justify-between items-center text-[11px] text-slate-300">
                      <span>التقييم: <b className="text-amber-300">⭐ {auditor.rating}</b></span>
                      <span>المهام: <b className="text-white">{auditor.completedAudits}</b></span>
                    </div>

                    <button 
                      onClick={() => handleRequestAudit(auditor.name)}
                      disabled={auditor.status === 'مشغول حالياً'}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition shadow ${
                        auditor.status === 'متاح الآن' 
                          ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      طلب مراجعة عن بُعد 🤝
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* شاشة التدقيق التنبئي للتدفقات النقدية */}
        {activeTab === 'cashflow' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">التدقيق التنبئي للتدفقات النقدية (Predictive Cash Flow Auditing)</h2>
                <p className="text-xs text-slate-400">تحليل الذمم الدائنة والمدينة المستخرجة من الـ ERP للتنبؤ بالسيولة والعجز النقدي المستقبلي</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● النماذج التنبؤية نشطة
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">متغيرات التنبؤ والتحصيل</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400">معدل تأخر التحصيل المقدر (أيام):</label>
                  <input 
                    type="number" 
                    value={collectionDelayDays} 
                    onChange={(e) => setCollectionDelayDays(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 mt-2">
                  <span className="text-[11px] text-slate-400">توصية الذكاء الاصطناعي:</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    تظهر التحليلات ضغطاً متوقعاً في السيولة خلال شهر نوفمبر بسبب تأخر تحصيل العملاء. يوصى بتسريع إجراءات المطالبات قبل نهاية الشهر.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">توقعات التدفقات النقدية للأشهر القادمة ($)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 text-[11px]">
                        <th className="p-3 text-right border border-slate-800">الشهر</th>
                        <th className="p-3 text-right border border-slate-800">المقبوضات (الذمم المدينة)</th>
                        <th className="p-3 text-right border border-slate-800">المدفوعات (الذمم الدائنة)</th>
                        <th className="p-3 text-right border border-slate-800">صافي التدفق</th>
                        <th className="p-3 text-center border border-slate-800">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-slate-200">
                      {cashFlowForecast.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 border border-slate-800 font-bold text-white">{item.month}</td>
                          <td className="p-3 border border-slate-800 text-emerald-400 font-mono">${item.receivables.toLocaleString()}</td>
                          <td className="p-3 border border-slate-800 text-rose-400 font-mono">${item.payables.toLocaleString()}</td>
                          <td className={`p-3 border border-slate-800 font-mono font-bold ${item.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            ${item.netCashFlow.toLocaleString()}
                          </td>
                          <td className="p-3 border border-slate-800 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                              item.status === 'آمن' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* شاشة مركز التنبيهات الفورية الذكية */}
        {activeTab === 'alerts' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">مركز التنبيهات الفورية الذكية (Smart Real-Time Alerts Center)</h2>
                <p className="text-xs text-slate-400">إشعارات لحظية تظهر أي مخالفة معيارية أو قيد مشبوه فور رفع الملف أو مزامنته مع الـ ERP</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● الرقابة الحية نشطة
              </span>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200">سجل التنبيهات الفورية ورصد المخاطر:</h3>
                <span className="text-[11px] text-slate-400">إجمالي التنبيهات: <b className="text-amber-400">{realTimeAlerts.length} تنبيهات</b></span>
              </div>
              <div className="flex flex-col gap-3">
                {realTimeAlerts.map(alert => (
                  <div key={alert.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">{alert.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">{alert.standard}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          alert.severity === 'حرج' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          alert.severity === 'تحذير' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* شاشة الضرائب والزكاة واكتشاف الاحتيال */}
        {activeTab === 'tax_fraud' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">محرك تدقيق الضرائب والزكاة واكتشاف الشذوذ والاحتيال (Zakat, Tax & Fraud ML Engine)</h2>
                <p className="text-xs text-slate-400">حساب الوعاء الزكوي والضريبي آلياً واكتشاف القيود المشبوهة وتجزئة الفواتير عبر النماذج الذكية</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● الحماية والتدقيق نشط
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">حاسبة و تدقيق الضرائب والزكاة</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400">نسبة الزكاة الشرعية (%):</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={zakatRate} 
                    onChange={(e) => setZakatRate(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400">نسبة ضريبة القيمة المضافة VAT (%):</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={vatRate} 
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">الوعاء الزكوي المقدر</span>
                    <span className="text-base font-bold text-amber-400">${Number(calculatedZakat).toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">ضريبة القيمة المضافة المقدرة</span>
                    <span className="text-base font-bold text-blue-400">${Number(calculatedVat).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">نماذج اكتشاف الاحتيال والشذوذ الآلي (Anomaly ML)</h3>
                <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                  {fraudAnomalies.map(item => (
                    <div key={item.id} className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-rose-400">{item.riskType}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          item.riskLevel === 'عالي' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          خطورة: {item.riskLevel}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-300">
                        <span>رقم القيد: <b className="font-mono text-amber-300">{item.entryNumber}</b></span>
                        <span>المبلغ: <b className="font-mono text-white">${item.amount.toLocaleString()}</b></span>
                      </div>
                      <p className="text-[10px] text-slate-400">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'adjustments' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">محرك قيود التسوية والتصحيح الآلي (Automated Adjustment Entries Engine)</h2>
                <p className="text-xs text-slate-400">توليد قيود المعالجة المحاسبية لمعايير IFRS وترحيلها لحظياً لنظام الـ ERP عبر الـ API</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● جاهز للترحيل السحابي
              </span>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold text-slate-200">القيود المقترحة بناءً على نتائج الفحص المعياري الأخير:</h3>
                <span className="text-[11px] text-slate-400">نظام الـ ERP المحدد: <b className="text-amber-400">{selectedErpSystem}</b></span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 text-[11px]">
                      <th className="p-3 text-right border border-slate-800">المعيار</th>
                      <th className="p-3 text-right border border-slate-800">بيان القيد والتسوية المحاسبية</th>
                      <th className="p-3 text-right border border-slate-800">الطرف المدين</th>
                      <th className="p-3 text-right border border-slate-800">الطرف الدائن</th>
                      <th className="p-3 text-right border border-slate-800">المبلغ ($)</th>
                      <th className="p-3 text-center border border-slate-800">الحالة والإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-200">
                    {adjustmentEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 border border-slate-800 font-bold text-amber-400">{entry.standard}</td>
                        <td className="p-3 border border-slate-800">{entry.description}</td>
                        <td className="p-3 border border-slate-800 text-emerald-400">{entry.debitAccount}</td>
                        <td className="p-3 border border-slate-800 text-rose-400">{entry.creditAccount}</td>
                        <td className="p-3 border border-slate-800 font-mono font-bold">${entry.amount.toLocaleString()}</td>
                        <td className="p-3 border border-slate-800 text-center">
                          {entry.status === 'معلق' ? (
                            <button 
                              onClick={() => handlePushToErp(entry.id)}
                              className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition shadow"
                            >
                              ترحيل للـ ERP 🚀
                            </button>
                          ) : (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                              ✓ تم الترحيل للـ ERP
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ifrs_engine' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">محرك الامتثال المحاسبي المعياري الشامل (Comprehensive IFRS & IAS Engine)</h2>
                <p className="text-xs text-slate-400">إدارة وفحص المعايير الدولية وربطها التلقائي بـ SQL Views وقواعد التدقيق المالي</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● المحرك المعياري نشط
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-2 max-h-[65vh] overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 mb-2">اختر المعيار الدولي للفحص:</h3>
                {Object.entries(ifrsStandardsData).map(([key, standard]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedStandard(key)}
                    className={`p-3 rounded-xl text-right transition flex flex-col gap-1 border ${
                      selectedStandard === key 
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold">{standard.code}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">{standard.complianceRate} امتثال</span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate">{standard.title}</span>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-5 justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                        {currentStandard.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-2">{currentStandard.code}: {currentStandard.title}</h3>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl">
                      {currentStandard.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-xs font-bold text-slate-300">وصف نطاق المعيار والمعالجة المحاسبية:</h4>
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      {currentStandard.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-xs font-bold text-slate-300">استعلام الفحص المرتبط بقاعدة البيانات (T-SQL View):</h4>
                    <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl font-mono text-[11px] text-amber-300 overflow-x-auto">
                      {currentStandard.sqlView}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button 
                    onClick={() => alert(`تم تشغيل فحص الامتثال الآلي للمعيار ${currentStandard.code} بنجاح!`)}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg"
                  >
                    تشغيل فحص الامتثال الآلي لهذا المعيار ⚡
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ifrs' && <AuditRulesIFRS />}
        {activeTab === 'sql' && <SqlViewer />}
        
        {activeTab === 'simulator' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">مُحاكي السيناريوهات المالية والزكوية (Stress & Compliance Simulator)</h2>
                <p className="text-xs text-slate-400">اختبار تأثير متغيرات المعايير والنسب على صافي الربح والوعاء الزكوي لحظياً</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● وضع المحاكاة النشطة
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">متغيرات المحاكاة</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400">مخصص هبوط المخزون (IAS 2) ($):</label>
                  <input 
                    type="number" 
                    value={inventoryProvision} 
                    onChange={(e) => setInventoryProvision(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400">نسبة الزكاة / الضريبة الافتراضية (%):</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={zakatRate} 
                    onChange={(e) => setZakatRate(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] text-slate-400">معدل الخصم لنموذج القيمة الحالية (IFRS 16) (%):</label>
                  <input 
                    type="number" 
                    value={discountRate} 
                    onChange={(e) => setDiscountRate(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">النتائج المالية بعد المحاكاة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">صافي الربح المعدل بعد المخصصات</span>
                      <span className="text-lg font-bold text-amber-400">${Number(adjustedNetProfit).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">الوعاء الزكوي / الضريبي المقدر</span>
                      <span className="text-lg font-bold text-rose-400">${Number(calculatedZakat).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">صافي الربح النهائي بعد الزكاة</span>
                      <span className="text-lg font-bold text-emerald-400">${Number(netAfterZakat).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">معدل العائد على الأصول (ROA - محاكى)</span>
                      <span className="text-lg font-bold text-blue-400">+14.8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'erp' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">إعدادات الربط المباشر مع أنظمة ERP (Live API)</h2>
                <p className="text-xs text-slate-400">ربط محرك SAEIS مباشرة لتصدير القيود، التسوية واستيراد ميزان المراجعة آلياً</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● مركز الربط السحابي
              </span>
            </div>

            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300">نظام الـ ERP المستهدف:</label>
                  <select 
                    value={selectedErpSystem}
                    onChange={(e) => setSelectedErpSystem(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Odoo ERP (REST API)">Odoo ERP</option>
                    <option value="Onyx Pro (أونكس برو)">Onyx Pro (أونكس برو)</option>
                    <option value="SAP Business One">SAP Business One</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300">رابط نقطة الاتصال (API Endpoint):</label>
                  <input 
                    type="text" 
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-300">مفتاح المصادقة (API Key / Token):</label>
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">حالة الربط الحالية:</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                    connectionStatus.includes('متصل') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {connectionStatus}
                  </span>
                </div>
                <button 
                  onClick={handleTestConnection}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg"
                >
                  اختبار الاتصال وحفظ البيانات ⚡
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cfo' && (
          <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-amber-400 mb-1">المستشار المالي الذكي (CFO AI Advisor & Assistant Engine)</h2>
                <p className="text-xs text-slate-400">مساعدك الذكي للإجابة عن الاستفسارات المحاسبية وتحليل التوصيات المالية وفق IFRS وتدقيق الـ ERP</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ● المحرك الذكي متصل
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
                <span className="text-[11px] text-slate-400">مؤشر الامتثال لـ IFRS</span>
                <span className="text-lg font-bold text-emerald-400">96.4%</span>
                <span className="text-[10px] text-emerald-500/80">▲ مرتفع جداً ومطابق للمتطلبات</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
                <span className="text-[11px] text-slate-400">المدققون المتاحون في السوق</span>
                <span className="text-lg font-bold text-amber-400">{auditorsList.filter(a => a.status === 'متاح الآن').length} مكاتب</span>
                <span className="text-[10px] text-amber-500/80">● جاهزون للمراجعة عن بُعد</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
                <span className="text-[11px] text-slate-400">التنبيهات الفورية النشطة</span>
                <span className="text-lg font-bold text-rose-400">{realTimeAlerts.length} تنبيه</span>
                <span className="text-[10px] text-rose-500/80">⚡ تتطلب مراجعة فورية</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-1">
                <span className="text-[11px] text-slate-400">حالة الربط السحابي</span>
                <span className="text-lg font-bold text-emerald-400">نشط (Active)</span>
                <span className="text-[10px] text-slate-400">مزامنة لحظية مع النظام</span>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between h-[55vh] overflow-hidden">
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-2">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed font-mono ${
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
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="اسأل المستشار الذكي عن سوق المدققين، التدفقات النقدية، أو التنبيهات..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
                <button 
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg"
                >
                  إرسال ✉
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* نافذة رفع ملف البيانات المنبثقة */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-5 relative animate-in fade-in zoom-in-95 duration-150">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-amber-400">رفع ملف البيانات (Excel / CSV)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">اختر نظام ERP الأصلي وقم برفع ملف ميزان المراجعة أو القيود</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-300">اختر نظام ERP الأصلي:</label>
              <select 
                value={modalErpSystem}
                onChange={(e) => setModalErpSystem(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Odoo ERP">Odoo ERP</option>
                <option value="Onyx Pro (أونكس برو)">Onyx Pro (أونكس برو)</option>
                <option value="SAP Business One">SAP Business One</option>
                <option value="ملف إكسيل عام">ملف إكسيل عام</option>
              </select>
            </div>

            {/* حقل اختيار الملف الفعلي من جهاز الكمبيوتر */}
<label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center block space-y-2 bg-slate-950/50 cursor-pointer transition">
  <input 
    type="file" 
    accept=".xlsx, .xls, .csv" 
    className="hidden" 
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        // تحديث حالة اسم الملف المختار ليعرض اسم ملفك الحقيقي
        setModalErpSystem(e.target.files[0].name);
      }
    }}
  />
  <div className="text-xl">📊</div>
  <div className="text-xs font-bold text-slate-200">انقر هنا لاختيار ملف الإكسل من سطح المكتب</div>
  <div className="text-[10px] text-slate-400">يدعم ملفات Excel (.xlsx) أو CSV</div>
</label>
            <button 
              onClick={() => {
                alert("تمت معالجة وتدقيق الملف بنجاح!");
                setShowUploadModal(false);
              }}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-xs transition shadow-lg mt-1"
            >
              بدء المعالجة والتدقيق ⚡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}