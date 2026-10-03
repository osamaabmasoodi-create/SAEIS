// ملف الثوابت والإعدادات العامة لمنظومة SAEIS للتدقيق المالي والربط الذكي

export const APP_NAME = "منظومة SAEIS للتدقيق المالي والربط الذكي";
export const APP_VERSION = "2.5.0";

// المعايير الدولية المدعومة في المحرك الرقابي
export const SUPPORTED_IFRS_IAS = [
  { code: "IAS 16", name: "العقارات والآلات والمعدات", category: "PPE" },
  { code: "IFRS 16", name: "عقود الإيجار", category: "Leases" },
  { code: "IFRS 9", name: "الأدوات المالية (ECL)", category: "Financial Instruments" },
  { code: "IFRS 15", name: "الإيرادات من العقود مع العملاء", category: "Revenue" },
  { code: "IAS 2", name: "المخزون (NRV)", category: "Inventory" },
];

// إعدادات الربط الافتراضية مع أنظمة ERP (مثل Odoo / SAP / Onyx Pro)
export const DEFAULT_ERP_CONFIG = {
  systemName: "Odoo ERP (REST API)",
  endpoint: "https://erp.company.com/api/v1",
  status: "غير متصل",
};

// الأخطاء والتحفظات الافتراضية في ميزان المراجعة (تستوعب حتى 25,000+ حساب وسجل)
export const INITIAL_AUDIT_EXCEPTIONS = [
  {
    id: 1,
    standard: "IAS 16",
    description: "رأسمالة مصاريف صيانة دورية كأصل ثابت بشكل خاطئ",
    impact: 25000,
    correctionEntry: "فصل المبالغ وتحويلها لحساب مصروف الصيانة التشغيلي",
    status: "معلق",
  },
  {
    id: 2,
    standard: "IFRS 16",
    description: "تحميل عقود إيجار التشغيل للمصروف مباشرة بدلاً من أصل ROU",
    impact: 120000,
    correctionEntry: "إثبات أصل حق الاستخدام (ROU Asset) مقابل التزام الإيجار",
    status: "معلق",
  },
  {
    id: 3,
    standard: "IFRS 9",
    description: "عدم احتساب مخصص خسائر ائتمانية متوقعة للذمم المتقادمة ECL",
    impact: 18500,
    correctionEntry: "قيد مصروف الخسائر الائتمانية مقابل مخصص ECL",
    status: "معلق",
  },
  {
    id: 4,
    standard: "IFRS 15",
    description: "تسجيل دفعة مقدمة كإيراد مباشر قبل نقل السيطرة للعميل",
    impact: 45000,
    correctionEntry: "تحويل المبلغ إلى حساب التزام عقد (Contract Liability)",
    status: "معلق",
  },
];