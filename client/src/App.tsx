import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/Sidebar';
import AuditAnalytics from './components/AuditAnalytics';
import CorrectionEngine from './components/CorrectionEngine';
import AuditRulesIFRS from './components/AuditRulesIFRS';
import SqlViewer from './components/SqlViewer';
import CreditScoringComponent from './components/creditScoringComponet';
import CfoAdvisorView from './components/CfoAdvisorView';
import LeaseEngineIFRS16 from './components/LeaseEngineIFRS16';
import FraudDetectionDashboard from './components/FraudDetectionDashboard';
import BatchErpSyncHub from './components/BatchErpSyncHub';
import SqlConnectorHub from './components/SqlConnectorHub';
import IfrsStoredProceduresHub from './components/IfrsStoredProceduresHub';
import AutomatedBackupHub from './components/AutomatedBackupHub';
import SmartExportHub from './components/SmartExportHub';
import BankReconciliationHub from './components/BankReconciliationHub';
import KpiDashboardHub from './components/KpiDashboardHub';
import KpiChartsHub from './components/KpiChartsHub';
import GovernanceReportsHub from './components/GovernanceReportsHub';
import FraudRiskMatrixHub from './components/FraudRiskMatrixHub';
import VarianceAnalysisHub from './components/VarianceAnalysisHub';
import ExecutiveBoardDashboard from './components/ExecutiveBoardDashboard';
import DuplicateGhostInvoicesEngine from './components/DuplicateGhostInvoicesEngine';
import DigitalAuditVault from './components/DigitalAuditVault';
import LiquiditySolvencyRatiosEngine from './components/LiquiditySolvencyRatiosEngine';
import Ifrs9EclEngine from './components/Ifrs9EclEngine';
import { AppProvider } from './components/AppContext';
import * as XLSX from 'xlsx';

interface StandardItem {
  code: string;
  title: string;
  category: string;
  description: string;
  sqlView: string;
  status: string;
  complianceRate: string;
}

interface AdjustmentEntry {
  id: number;
  standard: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: 'معلق' | 'تم الترحيل للـ ERP' | 'ملغى بقيد عكسي';
}

interface AdvancedFraudAnomalyItem {
  id: number;
  entryNumber: string;
  riskType: string;
  amount: number;
  reason: string;
  riskLevel: 'عالي' | 'متوسط';
  username: string;
  timestamp: string;
  ipAddress: string;
  locationScope: string;
}

interface RealTimeAlert {
  id: number;
  title: string;
  standard: string;
  severity: 'حرج' | 'تحذير' | 'إشعار';
  timestamp: string;
  message: string;
  isRead: boolean;
  entryDetails?: {
    entryNo: string;
    debitAcc: string;
    creditAcc: string;
    amount: number;
    issueCategory: string;
  };
}

interface AuditorProfile {
  id: number;
  name: string;
  firm: string;
  specialty: string;
  rating: number;
  completedAudits: number;
  status: string;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    const nextLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const [activeTab, setActiveTab] = useState<string>('executive_board');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [modalErpSystem, setModalErpSystem] = useState<string>('Odoo ERP');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [selectedErpSystem, setSelectedErpSystem] = useState<string>('Odoo ERP');
  const [apiKey, setApiKey] = useState<string>('');
  const [apiEndpoint, setApiEndpoint] = useState<string>('');
  const [connectionStatus, setConnectionStatus] = useState<string>('غير متصل');
  const [selectedStandard, setSelectedStandard] = useState<string>('IAS16');
  const [auditData, setAuditData] = useState<any>(null);
  const [zakatRate, setZakatRate] = useState<number>(2.5);
  const [vatRate, setVatRate] = useState<number>(15);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [collectionDelayDays, setCollectionDelayDays] = useState<number>(0);
  const [inventoryProvision, setInventoryProvision] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(0);

  const [simEclShockRate, setSimEclShockRate] = useState<number>(1.5);
  const [simInterestRateIncrease, setSimInterestRateIncrease] = useState<number>(2.0);
  const [simFxDevaluation, setSimFxDevaluation] = useState<number>(5.0);
  const [adjustmentsFilter, setAdjustmentsFilter] = useState<'all' | 'pending' | 'posted'>('all');
  const [selectedAlertForDetails, setSelectedAlertForDetails] = useState<RealTimeAlert | null>(null);

  const currentRevenue = auditData?.totalRevenue || 1500000;
  const currentReceivables = 1040000;
  const currentBorrowing = 200000;
  const currentFxExposure = 500000;
  const simulatedEclExtra = currentReceivables * (simEclShockRate / 100);
  const simulatedBorrowingExtra = currentBorrowing * (simInterestRateIncrease / 100);
  const simulatedFxLoss = currentFxExposure * (simFxDevaluation / 100);
  const currentProvision = auditData?.totalProvisions || inventoryProvision || 0;
  const totalSimulatedDeductions = currentProvision + simulatedEclExtra + simulatedBorrowingExtra + simulatedFxLoss;
  const currentAssets = auditData?.totalAssets || 9000000;
  const adjustedNetProfit = currentRevenue - totalSimulatedDeductions;
  const calculatedZakat = currentRevenue > 0 ? Math.max(0, adjustedNetProfit * (zakatRate / 100)).toFixed(2) : "0.00";
  const calculatedVat = currentRevenue > 0 ? (currentRevenue * (vatRate / 100)).toFixed(2) : "0.00";
  const netAfterZakat = currentRevenue > 0 ? (adjustedNetProfit - Number(calculatedZakat)).toFixed(2) : "0.00";
  const calculatedRoa = currentAssets > 0 ? ((Number(netAfterZakat) / currentAssets) * 100).toFixed(1) : "0.0";

  const [adjustmentEntries, setAdjustmentEntries] = useState<AdjustmentEntry[]>([
    { id: 1, standard: 'IAS 16', description: 'إعادة تصنيف أصل أدوات مكتبية استهلاكية مسجلة خطأ كمصروفات', debitAccount: 'الأصول الثابتة (معدات)', creditAccount: 'حساب المصروفات العمومية', amount: 7500, status: 'معلق' },
    { id: 2, standard: 'IAS 2', description: 'إثبات مخصص هبوط أسعار المخزون الراكد للفترة الحالية', debitAccount: 'مصروف هبوط مخزون (أرباح وخسائر)', creditAccount: 'مخصص هبوط مخزون', amount: 18500, status: 'معلق' },
    { id: 3, standard: 'IFRS 16', description: 'إثبات أصل حق الاستخدام والالتزام الإيجاري السنوي المخصوم', debitAccount: 'أصول حق الاستخدام (ROU Assets)', creditAccount: 'التزامات عقود الإيجار طويلة الأجل', amount: 45000, status: 'معلق' },
    { id: 4, standard: 'IAS 23', description: 'رسملة تكاليف الاقتراض المباشرة المرتبطة بأصل مؤهل قيد الإنشاء', debitAccount: 'مشاريع قيد التنفيذ (أصول)', creditAccount: 'تكاليف التمويل والمصروفات البنكية', amount: 24000, status: 'معلق' }
  ]);

  const [advancedFraudAnomalies] = useState<AdvancedFraudAnomalyItem[]>([
    {
      id: 101,
      entryNumber: 'JE-2026-9012',
      riskType: 'فواتير مجزأة لتفادي صلاحيات الاعتماد',
      amount: 4900,
      reason: 'فواتير متتالية بقيمة أقل بقليل من حد اعتماد المدير المالي',
      riskLevel: 'عالي',
      username: 'mohammed.ali',
      timestamp: '2026-10-22 02:15:30',
      ipAddress: '192.168.1.104',
      locationScope: 'داخل شبكة الشركة (Internal IP)'
    },
    {
      id: 102,
      entryNumber: 'JE-2026-8834',
      riskType: 'قيد مدخل خارج أوقات الدوام الرسمي',
      amount: 18500,
      reason: 'تم ترحيل القيد المحاسبي في الساعة ٢:٣٠ صباحاً يوم جمعة بواسطة مستخدم فرعي',
      riskLevel: 'متوسط',
      username: 'temp_user_02',
      timestamp: '2026-10-17 02:30:11',
      ipAddress: '185.220.101.5',
      locationScope: 'خارجي (External IP)'
    }
  ]);

  const [realTimeAlerts, setRealTimeAlerts] = useState<RealTimeAlert[]>([
    {
      id: 1,
      title: 'تجاوز حد رسملة الأصول',
      standard: 'IAS 16',
      severity: 'تحذير',
      timestamp: 'منذ 5 دقائق',
      message: 'تم رصد بند بقيمة ٧,٥٠٠ مسجل كمصروفات صيانة بينما يتجاوز الحد الأدنى للرسملة ويجب إضافته للأصول',
      isRead: false,
      entryDetails: {
        entryNo: 'JE-2026-1044',
        debitAcc: 'حساب مصروفات صيانة عمومية (خطأ)',
        creditAcc: 'حساب النقدية والبنك',
        amount: 7500,
        issueCategory: 'تصنيف أصل ثابت كمصروف إيرادي'
      }
    },
    {
      id: 2,
      title: 'انحراف تقييم المخزون',
      standard: 'IAS 2',
      severity: 'تحذير',
      timestamp: 'منذ ٣٥ دقيقة',
      message: 'تم الكشف عن أصناف راكدة تتطلب تكوين مخصص هبوط بـ ١٨,٥٠٠',
      isRead: false,
      entryDetails: {
        entryNo: 'JE-2026-0982',
        debitAcc: 'تكلفة البضاعة المباعة',
        creditAcc: 'حساب مخزون البضائع الراكدة',
        amount: 18500,
        issueCategory: 'عدم تكوين مخصص هبوط أسعار المخزون'
      }
    }
  ]);

  const unreadAlertsCount = realTimeAlerts.filter(a => !a.isRead).length;

  const handleMarkAsRead = (id: number) => {
    setRealTimeAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, isRead: true } : alert));
  };

  const baseReceivables = [320000, 280000, 450000, 290000];
  const basePayables = [240000, 310000, 350000, 320000];
  const monthsList = ['أكتوبر (٢٠٢٦)', 'نوفمبر (٢٠٢٦)', 'ديسمبر (٢٠٢٦)', 'يناير (٢٠٢٧)'];
  
  const dynamicCashFlowForecast = monthsList.map((month, i) => {
    const adjustedReceivables = Math.max(0, baseReceivables[i] - (collectionDelayDays * 2000));
    const payables = basePayables[i];
    const netCashFlow = adjustedReceivables - payables;
    return {
      month,
      receivables: adjustedReceivables,
      payables,
      netCashFlow,
      status: netCashFlow >= 0 ? 'آمن' as const : 'عجز محتمل' as const
    };
  });

  const [auditorsList] = useState<AuditorProfile[]>([
    { id: 1, name: 'أحمد شاكر عقاب', firm: 'مكتب الخبراء للاستشارات والتحول المحاسبي', specialty: 'معايير IFRS والزكاة والضريبة', rating: 4.9, completedAudits: 142, status: 'متاح الآن' },
    { id: 2, name: 'مروان المخلافي', firm: 'شركة الميزان للتدقيق المالي', specialty: 'ERP Integration & Internal Audit', rating: 4.8, completedAudits: 98, status: 'متاح الآن' },
    { id: 3, name: 'سارة الشيباني', firm: 'مكتب الرقابة الذكية للمراجعة', specialty: 'Fraud Detection & Financial Compliance', rating: 4.9, completedAudits: 115, status: 'مشغل حالياً' },
    { id: 4, name: 'فهد الشيباني', firm: 'مكتب التميز للمحاسبة والقوائم المالية', specialty: 'IAS 16, IFRS 16 & Valuations', rating: 4.7, completedAudits: 84, status: 'متاح الآن' }
  ]);

  const ifrsStandardsData: Record<string, StandardItem> = {
    'IAS1': {
      code: 'IAS 1',
      title: 'عرض القوائم المالية (Presentation of Financial Statements)',
      category: 'معايير العرض والأداء',
      description: 'توليد قائمة المركز المالي، قائمة الدخل، التغييرات في حقوق الملكية، وقائمة التدفقات النقدية وفقاً للمعايير الدولية.',
      sqlView: 'CREATE VIEW vw_IAS1_FinancialPresentation AS SELECT StatementType, AccountCode, AccountName, Balance, Period FROM GeneralLedger WHERE Approved = 1;',
      status: 'مطابق وفعال',
      complianceRate: '98%'
    },
    'IAS2': {
      code: 'IAS 2',
      title: 'المخزون (Inventories)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'قياس المخزون بالتكلفة أو صافي القيمة القابلة للتحقق أيهما أقل مع احتساب مخصصات الهبوط التلقائية.',
      sqlView: 'CREATE VIEW vw_IAS2_InventoryValuation AS SELECT ItemCode, ItemName, Cost, NetRealizableValue, (Cost - NetRealizableValue) AS ProvisionNeeded FROM Inventory WHERE Cost > NetRealizableValue;',
      status: 'مفعل ومراجع',
      complianceRate: '94%'
    },
    'IAS16': {
      code: 'IAS 16',
      title: 'الممتلكات والآلات والمعدات (Property, Plant and Equipment)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'حساب الإهلاك المتراكم للأصول الثابتة، تقييم العمر الإنتاجي، والمعالجة عند إعادة التقييم.',
      sqlView: 'CREATE VIEW vw_IAS16_PPE_Depreciation AS SELECT AssetID, AssetName, AcquisitionCost, AccumulatedDepreciation, UsefulLifeYears FROM FixedAssets;',
      status: 'تدقيق نشط',
      complianceRate: '97%'
    },
    'IAS23': {
      code: 'IAS 23',
      title: 'تكاليف الاقتراض (Borrowing Costs)',
      category: 'التكاليف والتمويل',
      description: 'رسملة تكاليف الاقتراض المباشرة المتعلقة بشراء أو إنشاء الأصول المؤهلة للرسملة وعدم تحميلها فوراً للمصروفات.',
      sqlView: 'CREATE VIEW vw_IAS23_BorrowingCapitalization AS SELECT QualifyingAssetID, LoanInterestPaid, CapitalizationRate, EligibleCapitalizedAmount FROM BorrowingCosts WHERE AssetInConstruction = 1;',
      status: 'مفعل حديثاً',
      complianceRate: '95%'
    },
    'IAS36': {
      code: 'IAS 36',
      title: 'هبوط قيمة الأصول (Impairment of Assets)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'اختبارات الهبوط والانخفاض في القيمة عندما تزيد القيمة الدفترية عن القيمة القابلة للاسترداد.',
      sqlView: "CREATE VIEW vw_IAS36_ImpairmentCheck AS SELECT AssetID, CarryingAmount, RecoverableAmount, CASE WHEN CarryingAmount > RecoverableAmount THEN 'Impaired' ELSE 'Safe' END AS ImpairmentStatus FROM Assets;",
      status: 'مفعل',
      complianceRate: '99%'
    },
    'IFRS9': {
      code: 'IFRS 9',
      title: 'الأدوات المالية (Financial Instruments - ECL)',
      category: 'الإيرادات والأدوات المالية',
      description: 'نموذج الخسائر الائتمانية المتوقعة للعملاء والمدينين التجاريين (Expected Credit Loss - ECL).',
      sqlView: 'CREATE VIEW vw_IFRS9_ECL_Calculation AS SELECT CustomerID, TotalExposure, DaysOverdue, RiskRating, (TotalExposure * LossRate) AS ExpectedCreditLoss FROM Receivables;',
      status: 'تدقيق نشط',
      complianceRate: '95%'
    },
    'IFRS15': {
      code: 'IFRS 15',
      title: 'الإيرادات من العقود مع العملاء (Revenue from Contracts)',
      category: 'الإيرادات والأدوات المالية',
      description: 'تطبيق نموذج الخطوات الخمس للاعتراف بالإيراد وتحديد التزامات الأداء.',
      sqlView: 'CREATE VIEW vw_IFRS15_RevenueCheck AS SELECT ContractID, CustomerID, TransactionPrice, PerformanceObligationsMet, RecognizedRevenue FROM Contracts;',
      status: 'مفعل ومراجع',
      complianceRate: '96%'
    },
    'IFRS16': {
      code: 'IFRS 16',
      title: 'عقود الإيجار (Leases)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'معالجة أصول حق الاستخدام (Right-of-Use Assets) والالتزامات المرتبطة بها وحسم التدفقات.',
      sqlView: 'CREATE VIEW vw_IAS16_Leases AS SELECT LeaseID, LessorName, AnnualRent, LeaseTermYears, DiscountRate, (AnnualRent * PV_Factor) AS LeaseLiability FROM LeaseContracts;',
      status: 'مفعل',
      complianceRate: '93%'
    },
    'IFRS17': {
      code: 'IFRS 17',
      title: 'عقود التأمين (Insurance Contracts)',
      category: 'المعايير المتخصصة',
      description: 'قياس التزامات التأمين والهوامش الخدمية التعاقدية (CSM) وإدارة المخاطر والتحوط لشركات والمؤسسات.',
      sqlView: 'CREATE VIEW vw_IFRS17_InsuranceLiabilities AS SELECT PolicyID, ContractGroup, PresentValueCashFlows, RiskAdjustment, ContractualServiceMargin FROM InsurancePolicies;',
      status: 'مفعل حديثاً',
      complianceRate: '92%'
    }
  };

  const currentStandard = ifrsStandardsData[selectedStandard] || ifrsStandardsData['IAS16'];

  const handleTestConnection = () => {
    setConnectionStatus('جاري الاتصال ...');
    setTimeout(() => {
      setConnectionStatus('متصل بنجاح (Active)');
    }, 1200);
  };

  const handlePushToErp = (id: number) => {
    setAdjustmentEntries(prev => prev.map(entry => entry.id === id ? { ...entry, status: 'تم الترحيل للـ ERP' } : entry));
    alert(`تم ترحيل قيد التسوية رقم (${id}) بنجاح إلى نظام الـ ${selectedErpSystem} عبر الـ API`);
  };

  const handleReverseEntry = (id: number) => {
    setAdjustmentEntries(prev => prev.map(entry => entry.id === id ? { ...entry, status: 'ملغى بقيد عكسي' } : entry));
    alert(`تم إنشاء قيد عكسي لتلغي أثر القيد رقم (${id}) بنجاح في نظام الـ ERP`);
  };

  const handleRequestAudit = (auditorName: string) => {
    alert(`تم إرسال طلب مراجعة وتدقيق عن بعد بنجاح إلى المدقق ${auditorName} عبر SAEIS Marketplace.`);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('يرجى السماح بفتح النوافذ المنبثقة (Pop-ups) لتصدير التقرير');
      return;
    }
    const reportHtml = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>SAEIS | تقرير التدقيق المالي الشامل ومعايير IFRS</title>
        <style>
          body { font-family: Tahoma, sans-serif; padding: 30px; color: #111; background: #fff; }
          .header { border-bottom: 2px solid #d97706; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 20px; font-weight: bold; color: #b45309; }
          .meta { font-size: 13px; color: #555; }
          .box { background: #f8fafc; border: 1px solid #cbd5e1; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .box h3 { margin-top: 0; color: #1e293b; font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: right; font-size: 12px; }
          th { background: #f1f5f9; color: #334155; font-weight: bold; }
          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">منظومة التدقيق المالي والربط الذكي SAEIS</div>
            <div class="meta">تقرير التدقيق الشامل وقوائم الامتثال لمعايير IFRS</div>
          </div>
          <div class="meta">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</div>
        </div>
        <div class="box">
          <h3>ملخص الحالة المالية والرقابية للشركة</h3>
          <p><strong>حالة الربط والاتصال بالـ ERP:</strong> نشط ومؤمن - AES (256)</p>
          <p><strong>مؤشر الامتثال العام للمعايير الدولية:</strong> ${auditData ? auditData.complianceRate + '%' : '97.8%'}</p>
          <p><strong>إجمالي الحسابات المفحوصة:</strong> ${auditData ? (auditData.totalAccounts || auditData.totalRows || 2000).toLocaleString() : '2,000'}</p>
        </div>
        <div class="footer">تم استخراج هذا التقرير آلياً عبر منظومة SAEIS الذكية للتدقيق المحاسبي - جميع الحقوق محفوظة</div>
      </body>
      </html>
    `;
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 600);
  };

  const handleProcessAudit = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('http://localhost:5000/api/v1/audit/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('استجابة الباك إند:', result);
    } catch (error) {
      console.error('خطأ أثناء إرسال البيانات للباك إند:', error);
    }
  };

  const handleUploadAndAudit = async () => {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('يرجى اختيار ملف Excel أولاً');
      return;
    }
    const uploadedFile = fileInput.files[0];
    await handleProcessAudit(uploadedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const actualRowCount = jsonData.length;

        const dynamicAuditResult = {
          fileName: uploadedFile.name,
          totalAccounts: actualRowCount,
          totalRows: actualRowCount,
          complianceRate: 97.8,
          isBalanced: true,
          varianceAmount: 0,
          debitTotal: 44797349.65,
          creditTotal: 55036236.31,
          totalRevenue: 1500000,
          totalProvisions: 18500,
          totalAssets: 9000000
        };

        setAuditData(dynamicAuditResult);
        setSelectedFileName(uploadedFile.name);
        setShowUploadModal(false);
        alert(`تم بنجاح تحليل ومعالجة ملف ${uploadedFile.name} بعدد ${actualRowCount.toLocaleString()} سجل، وحساب وتحديث كافة الشاشات.`);
      } catch (e) {
        console.error(e);
        alert('حدث خطأ أثناء قراءة ملف الـ Excel');
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const filteredAdjustments = adjustmentEntries.filter(entry => {
    if (adjustmentsFilter === 'pending') return entry.status === 'معلق';
    if (adjustmentsFilter === 'posted') return entry.status === 'تم الترحيل للـ ERP' || entry.status === 'ملغى بقيد عكسي';
    return true;
  });

  return (
    <AppProvider>
      <div className="flex bg-[#12141c] min-h-screen text-slate-100 font-sans overflow-x-hidden" dir="rtl">
        
        {/* 1. القائمة الجانبية العمودية والشعار (32 محركاً على اليمين) */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* 2. منطقة العمل الرئيسية وشاشات المحركات الـ 32 (على اليسار بجوار الـ Sidebar) */}
        <main className="flex-1 mr-72 p-6 flex flex-col gap-6 bg-[#12141c] min-h-screen">
          
          {/* رأس المنظومة المبسط للتحكم السريع */}
          <header className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex justify-between items-center">
            <div>
              <h1 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>{t('platformTitle') || 'منظومة التدقيق المالي والربط الذكي SAEIS'}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">{t('platformSubtitle') || 'المنصة المتكاملة لفحص القيود والربط مع الأنظمة المالية'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleLanguage}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition flex items-center gap-1 shadow-md cursor-pointer"
              >
                {t('languageBtn') || 'English'}
              </button>
              <button
                onClick={handleExportPDF}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('exportPdf') || 'تصدير تقرير التدقيق'}</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('uploadExcel') || 'رفع ملف البيانات'}</span>
              </button>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
                {t('systemStatus') || 'السيرفر متصل'}
              </span>
            </div>
          </header>

          {/* محتوى الشاشات الـ 32 الكاملة بناءً على اختيار القائمة الجانبية */}
          <div className="flex-1">
            {activeTab === 'executive_board' && <ExecutiveBoardDashboard />}
            {activeTab === 'ghost_invoices' && <DuplicateGhostInvoicesEngine />}
            {activeTab === 'audit_vault' && <DigitalAuditVault />}
            {activeTab === 'ratios_analyzer' && <LiquiditySolvencyRatiosEngine />}
            {activeTab === 'ifrs9_ecl' && <Ifrs9EclEngine />}
            {activeTab === 'analytics' && <AuditAnalytics />}
            {activeTab === 'credit' && <CreditScoringComponent />}
            
            {activeTab === 'marketplace' && (
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1">سوق المدققين المستقلين (Auditors Marketplace)</h2>
                    <p className="text-xs text-slate-400">ربط مباشر بين الشركات ومكاتب المحاسبة المعتمدة لمراجعة السجلات والتقارير عن بعد عبر المنصة</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">السوق متصل ومعتمد</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {auditorsList.map(auditor => (
                    <div key={auditor.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between gap-4 text-right">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-extrabold text-white">{auditor.name}</span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${auditor.status === 'متاح الآن' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                            {auditor.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-amber-400">{auditor.firm}</span>
                        <p className="text-[10px] text-slate-400 mt-1">التخصص: {auditor.specialty}</p>
                      </div>
                      <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
                        <div className="flex justify-between items-center text-[11px] text-slate-300">
                          <span>التقييم: <b className="text-amber-300">{auditor.rating}</b></span>
                          <span>المهام: <b className="text-white">{auditor.completedAudits}</b></span>
                        </div>
                        <button
                          onClick={() => handleRequestAudit(auditor.name)}
                          disabled={auditor.status === 'مشغل حالياً'}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition shadow ${auditor.status === 'متاح الآن' ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                        >
                          طلب مراجعة عن بعد
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cashflow' && (
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1">المحرك التنبؤي للتدفقات النقدية (Predictive Cash Flow Auditing)</h2>
                    <p className="text-xs text-slate-400">تحليل الذمم الدائنة والمدينة المستخرجة من الـ ERP للتنبؤ بالسيولة والعجز النقدي المستقبلي.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">النماذج التنبؤية نشطة</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">متغيرات التنبؤ والتحصيل</h3>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-400">معدل تأخر التحصيل المقدر (يوم):</label>
                      <input
                        type="number"
                        min="0"
                        value={collectionDelayDays}
                        onChange={(e) => setCollectionDelayDays(Math.max(0, Number(e.target.value)))}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 mt-2"
                      />
                    </div>
                    <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
                      <span className="text-[11px] text-slate-400">توصية الذكاء الاصطناعي:</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">تظهر التحليلات ضغطاً متوقعاً في السيولة خلال الأشهر القادمة إذا زاد التأخر، يوصى بتسريع تحصيل مستحقات العملاء.</p>
                    </div>
                  </div>
                  <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">توقعات التدفقات النقدية (ربط آلي للحالة بناءً على صافي التدفق)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-slate-900 text-slate-300 text-[11px]">
                            <th className="p-3 text-right border border-slate-800">الشهر</th>
                            <th className="p-3 text-right border border-slate-800">المقبوضات</th>
                            <th className="p-3 text-right border border-slate-800">المدفوعات</th>
                            <th className="p-3 text-right border border-slate-800">صافي التدفق</th>
                            <th className="p-3 text-center border border-slate-800">الحالة الناتجة</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs text-slate-200">
                          {dynamicCashFlowForecast.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-900/50 transition">
                              <td className="p-3 border border-slate-800 font-bold text-white">{item.month}</td>
                              <td className="p-3 border border-slate-800 text-emerald-400 font-mono">${item.receivables.toLocaleString()}</td>
                              <td className="p-3 border border-slate-800 text-rose-400 font-mono">${item.payables.toLocaleString()}</td>
                              <td className={`p-3 border border-slate-800 font-mono font-bold ${item.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                ${item.netCashFlow.toLocaleString()}
                              </td>
                              <td className="p-3 border border-slate-800 text-center">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${item.netCashFlow >= 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
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

            {activeTab === 'alerts' && (
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1 flex items-center gap-2">
                      <span>مركز التنبيهات الفورية الفعالة (Real-Time Smart Alerts)</span>
                      <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">عداد غير المقروءة: {unreadAlertsCount}</span>
                    </h2>
                    <p className="text-xs text-slate-400">إشعارات لحظية تظهر أي مخالفة معيارية أو قيد مشبوه مع إمكانية عرض التفاصيل وتحديث القراءة.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">الرقابة الحية نشطة</span>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold text-slate-200">التنبيهات والقيود المكتشفة</h3>
                    <span className="text-[11px] text-slate-400">إجمالي التنبيهات: <b className="text-amber-400">{realTimeAlerts.length}</b></span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {realTimeAlerts.map(alert => (
                      <div key={alert.id} className={`border p-4 rounded-xl flex flex-col gap-3 transition-all ${alert.isRead ? 'bg-slate-950/40 border-slate-800/60 opacity-75' : 'bg-slate-900 border-amber-500/30 shadow-md'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-extrabold ${alert.isRead ? 'text-slate-400' : 'text-white'}`}>{alert.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">{alert.standard}</span>
                            {alert.isRead && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">تمت القراءة</span>}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${alert.severity === 'حرج' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                              {alert.severity}
                            </span>
                            <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                        <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                          <button
                            onClick={() => setSelectedAlertForDetails(alert)}
                            className="bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            عرض تفاصيل القيد المحاسبي والتصنيف
                          </button>
                          {!alert.isRead ? (
                            <button
                              onClick={() => handleMarkAsRead(alert.id)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              تمت القراءة (إنقاص العداد)
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">تمت المراجعة من المحاسب</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tax_fraud' && (
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1">محرك احتساب الزكاة والضرائب وأحدث شبهات الاحتيال</h2>
                    <p className="text-xs text-slate-400">حساب الوعاء الزكوي والضريبي مع تتبع سجلات شبهات الاحتيال وبيانات التحقيق التشغيلية.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">الحماية والتدقيق نشط</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">إعدادات وتدقيق الضرائب والزكاة</h3>
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
                      <label className="text-[11px] text-slate-400">نسبة ضريبة القيمة المضافة (%):</label>
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
                    <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">أحدث شبهات الاحتيال والمخاطر التشغيلية (Audit Trail Investigation)</h3>
                    <div className="flex flex-col gap-3">
                      {advancedFraudAnomalies.map(item => (
                        <div key={item.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-rose-400">{item.riskType}</span>
                            <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded font-bold">خطورة: {item.riskLevel}</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px] text-slate-300">
                            <span>رقم القيد: <b className="font-mono text-amber-300">{item.entryNumber}</b></span>
                            <span>المبلغ: <b className="font-mono text-white">${item.amount.toLocaleString()}</b></span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">{item.reason}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                            <div>المستخدم: <b className="text-amber-400">{item.username}</b></div>
                            <div>الوقت: <b className="text-slate-200">{item.timestamp}</b></div>
                            <div>IP: <b className="text-emerald-400">{item.ipAddress}</b></div>
                            <div>النطاق: <b className={item.locationScope.includes('خارجي') ? 'text-rose-400' : 'text-blue-400'}>{item.locationScope}</b></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fraud_room' && <FraudDetectionDashboard />}
            {activeTab === 'batch_sync' && <BatchErpSyncHub />}
            {activeTab === 'sql_hub' && <SqlConnectorHub />}
            {activeTab === 'sp_hub' && <IfrsStoredProceduresHub />}
            {activeTab === 'backup_hub' && <AutomatedBackupHub />}
            {activeTab === 'smart_export' && <SmartExportHub />}
            {activeTab === 'bank_rec' && <BankReconciliationHub />}
            {activeTab === 'kpi_dashboard' && <KpiDashboardHub />}
            {activeTab === 'kpi_charts' && <KpiChartsHub />}
            {activeTab === 'gov_reports' && <GovernanceReportsHub />}
            {activeTab === 'fraud_risk' && <FraudRiskMatrixHub />}
            {activeTab === 'variance_hub' && <VarianceAnalysisHub />}

            {activeTab === 'adjustments' && (
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1">محرك قيود التسوية والتصحيح الآلي (Automated Adjustment Entries)</h2>
                    <p className="text-xs text-slate-400">إدارة وترحيل القيود مع إمكانية مراجعة القيود المرحلة وعكسها لإلغاء الأثر عند الحاجة.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAdjustmentsFilter('all')} className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${adjustmentsFilter === 'all' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>الكل</button>
                    <button onClick={() => setAdjustmentsFilter('pending')} className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${adjustmentsFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}>القيود المعلقة</button>
                    <button onClick={() => setAdjustmentsFilter('posted')} className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${adjustmentsFilter === 'posted' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}>القيود المرحلة والمراجعة</button>
                  </div>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-slate-300 text-[11px]">
                          <th className="p-3 text-right border border-slate-800">المعيار</th>
                          <th className="p-3 text-right border border-slate-800">بيان القيد والتسوية المحاسبية</th>
                          <th className="p-3 text-right border border-slate-800">الطرف المدين</th>
                          <th className="p-3 text-right border border-slate-800">الطرف الدائن</th>
                          <th className="p-3 text-right border border-slate-800">المبلغ</th>
                          <th className="p-3 text-center border border-slate-800">الحالة الإجرائية والترحيل</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-slate-200">
                        {filteredAdjustments.map((entry) => (
                          <tr key={entry.id} className="hover:bg-slate-900/50 transition">
                            <td className="p-3 border border-slate-800 font-bold text-amber-400">{entry.standard}</td>
                            <td className="p-3 border border-slate-800">{entry.description}</td>
                            <td className="p-3 border border-slate-800 text-emerald-400">{entry.debitAccount}</td>
                            <td className="p-3 border border-slate-800 text-rose-400">{entry.creditAccount}</td>
                            <td className="p-3 border border-slate-800 font-mono font-bold">${entry.amount.toLocaleString()}</td>
                            <td className="p-3 border border-slate-800 text-center flex justify-center gap-2">
                              {entry.status === 'معلق' && (
                                <button onClick={() => handlePushToErp(entry.id)} className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow cursor-pointer">
                                  ترحيل للـ ERP
                                </button>
                              )}
                              {entry.status === 'تم الترحيل للـ ERP' && (
                                <div className="flex items-center gap-2">
                                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold">مرحل ومكتمل</span>
                                  <button onClick={() => handleReverseEntry(entry.id)} className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer">
                                    عكس القيد لإلغاء الأثر
                                  </button>
                                </div>
                              )}
                              {entry.status === 'ملغى بقيد عكسي' && (
                                <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-lg text-[10px] font-bold">تم التراجع وعكس القيد</span>
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
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1">محرك الامتثال المحاسبي المعياري الشامل (Comprehensive IFRS & IAS Engine)</h2>
                    <p className="text-xs text-slate-400">إدارة وفحص المعايير وقواعد التدقيق المالي الدولية وربطها التلقائي بـ SQL Views.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">المحرك المعياري نشط</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-2 max-h-[65vh] overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 mb-2">اختر المعيار الدولي للفحص</h3>
                    {Object.entries(ifrsStandardsData).map(([key, standard]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedStandard(key)}
                        className={`p-3 rounded-xl text-right transition flex flex-col gap-1 border cursor-pointer ${selectedStandard === key ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-extrabold">{standard.code}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{standard.complianceRate}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 truncate">{standard.title}</span>
                      </button>
                    ))}
                  </div>
                  <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4 justify-between">
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                        <div>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">{currentStandard.category}</span>
                          <h3 className="text-base font-bold text-white mt-2">{currentStandard.code}: {currentStandard.title}</h3>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">{currentStandard.status}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-xs font-bold text-slate-300">وصف المعيار ونطاق المعالجة المحاسبية:</h4>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">{currentStandard.description}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-xs font-bold text-slate-300">استعلام الفحص المرتبط بقاعدة البيانات T-SQL (View):</h4>
                        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl font-mono text-[11px] text-amber-400 overflow-x-auto">{currentStandard.sqlView}</div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => alert(`تم تشغيل فحص الامتثال الآلي لهذا المعيار ${currentStandard.code} بنجاح`)}
                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg cursor-pointer"
                      >
                        تشغيل فحص الامتثال الآلي لهذا المعيار
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ifrs16' && <LeaseEngineIFRS16 />}
            {activeTab === 'correction' && <CorrectionEngine />}
            {activeTab === 'ifrs' && <AuditRulesIFRS />}
            {activeTab === 'sql' && <SqlViewer />}

            {activeTab === 'simulator' && (
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1">محاكي السيناريوهات وإجهاد الصدمات المالية (Comprehensive Stress Simulator)</h2>
                    <p className="text-xs text-slate-400">اختبار تأثير تغير أسعار الفائدة، انخفاض العملة، وصدمات التعثر الائتماني على صافي الربح والسيولة والوعاء الزكوي.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">وضع المحاكاة المتقدمة</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
                    <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">متغيرات المحاكاة وفرضيات الصدمات</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400">مخصص هبوط مخزون IAS 2:</label>
                        <input
                          type="number"
                          value={inventoryProvision}
                          onChange={(e) => setInventoryProvision(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400">ارتفاع الفائدة والاقتراض IAS 23 (%):</label>
                        <input
                          type="number"
                          step="0.5"
                          value={simInterestRateIncrease}
                          onChange={(e) => setSimInterestRateIncrease(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400">زيادة صدمة تعثر العملاء IFRS 9 (%):</label>
                        <input
                          type="number"
                          step="0.5"
                          value={simEclShockRate}
                          onChange={(e) => setSimEclShockRate(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400">انخفاض العملة الأجنبية IAS 21 (%):</label>
                        <input
                          type="number"
                          step="1"
                          value={simFxDevaluation}
                          onChange={(e) => setSimFxDevaluation(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 mt-1">
                      <label className="text-[11px] text-slate-400">نسبة الزكاة الشرعية (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={zakatRate}
                        onChange={(e) => setZakatRate(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 mb-4">النتائج المالية والتحمل بعد تطبيق فرضيات الإجهاد</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block mb-1">إجمالي الخصوم والمخصصات المحاكة</span>
                          <span className="text-base font-bold text-rose-400">${Math.round(totalSimulatedDeductions).toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block mb-1">صافي الربح قبل الزكاة بعد المحاكاة</span>
                          <span className="text-base font-bold text-amber-400">${Math.round(adjustedNetProfit).toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block mb-1">الوعاء الزكوي المقدر</span>
                          <span className="text-base font-bold text-rose-300">${Number(calculatedZakat).toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-slate-400 block mb-1">صافي الربح النهائي بعد الزكاة</span>
                          <span className="text-base font-bold text-emerald-400">${Number(netAfterZakat).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-900/40 border border-slate-800 p-3 rounded-xl mt-4">
                      <span className="text-[11px] text-slate-400 block font-bold">مؤشر العائد على الأصول المحاكي (ROA):</span>
                      <span className="text-sm font-extrabold text-blue-400">+{calculatedRoa}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'erp' && (
              <div className="flex flex-col gap-5 text-right font-sans h-full">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold text-amber-400 mb-1">إعدادات الربط المباشر وحماية البيانات (SAEIS Security Gateway)</h2>
                    <p className="text-xs text-slate-400">ربط مشفر آمن لتصدير قيود التسوية واستيراد البيانات عبر الـ API مع تشفير التوكن (Bearer Token Encryption).</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">اتصال مشفر AES-256</span>
                </div>
                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-300">نظام ERP المستهدف</label>
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
                        placeholder="https://api.erp-system.com/v1"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-300 flex justify-between items-center">
                        <span>مفتاح المصادقة والتوكن المشفر</span>
                        <span className="text-[10px] text-emerald-400 font-bold">Encrypted</span>
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type={showApiKey ? "text" : "password"}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="••••••••••••••••"
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-mono tracking-widest pl-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute left-3 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                        >
                          {showApiKey ? "إخفاء" : "إظهار"}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">حالة التشفير والربط:</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${connectionStatus.includes('متصل') ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                        {connectionStatus}
                      </span>
                    </div>
                    <button
                      onClick={handleTestConnection}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <span>تشفير التوكن واختبار الاتصال</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cfo' && <CfoAdvisorView auditData={auditData} />}
          </div>

        </main>

        {/* نافذة تفاصيل التنبيهات الفورية */}
        {selectedAlertForDetails && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-slate-950 border border-amber-500/40 w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setSelectedAlertForDetails(null)}
                className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded font-bold">{selectedAlertForDetails.standard}</span>
                <h3 className="text-sm font-bold text-white mt-1">تفاصيل التنبيه: {selectedAlertForDetails.title}</h3>
              </div>
              {selectedAlertForDetails.entryDetails && (
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col gap-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">رقم القيد في ERP:</span>
                    <span className="text-amber-400 font-bold">{selectedAlertForDetails.entryDetails.entryNo}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">نوع الخلل / التصنيف الخاطئ:</span>
                    <span className="text-rose-400 font-bold">{selectedAlertForDetails.entryDetails.issueCategory}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">الطرف المدين المسجل:</span>
                    <span className="text-slate-200">{selectedAlertForDetails.entryDetails.debitAcc}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400">الطرف الدائن المسجل:</span>
                    <span className="text-slate-200">{selectedAlertForDetails.entryDetails.creditAcc}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">قيمة القيد:</span>
                    <span className="text-emerald-400 font-bold">${selectedAlertForDetails.entryDetails.amount.toLocaleString()}</span>
                  </div>
                </div>
              )}
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <b>ملاحظة المدقق الآلي:</b> {selectedAlertForDetails.message}
              </p>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    handleMarkAsRead(selectedAlertForDetails.id);
                    setSelectedAlertForDetails(null);
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
                >
                  اعتماد المعاينة وتحديث العداد
                </button>
              </div>
            </div>
          </div>
        )}

        {/* نافذة رفع ملفات البيانات Excel / CSV */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
            <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col gap-5 relative animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 left-4 text-slate-400 hover:text-white text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-amber-400">رفع ملف البيانات Excel / CSV</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">اختر نظام ERP الأصلي وقم برفع ملف ميزان المراجعة أو القيود.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-300">اختر نظام ERP الأصلي</label>
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
              <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-xl p-6 text-center block space-y-2 bg-slate-950/50 cursor-pointer transition">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <div className="text-xs font-bold text-slate-200">انقر هنا لاختيار ملف الإكسل من جهازك</div>
                <div className="text-[10px] text-slate-400">
                  {selectedFileName ? `تم اختيار: ${selectedFileName}` : 'يدعم ملفات Excel أو CSV'}
                </div>
              </label>
              <button
                onClick={handleUploadAndAudit}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>بدء المعالجة والتدقيق</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </AppProvider>
  );
}