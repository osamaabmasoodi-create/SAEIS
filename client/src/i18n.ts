import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      platformTitle: "منظومة SAEIS للتدقيق المالي والربط الذكي",
      platformSubtitle: "المنصة المتكاملة لفحص القيود والربط مع الأنظمة المالية وتطبيق معايير IFRS",
      exportPdf: "تصدير تقرير التدقيق PDF",
      uploadExcel: "رفع ملف البيانات Excel / CSV",
      systemStatus: "حالة النظام مستقر وفعال",
      cfoAdvisor: "المستشار الذكي CFO AI",
      analytics: "لوحة التحليلات",
      creditScoring: "محرك التقييم الائتماني",
      marketplace: "سوق المدققين",
      cashFlow: "التدفقات النقدية",
      alerts: "التنبيهات الفورية",
      erpSync: "الربط المباشر ERP",
      languageBtn: "English"
    }
  },
  en: {
    translation: {
      platformTitle: "SAEIS Smart Audit & ERP Gateway",
      platformSubtitle: "Integrated platform for ledger auditing, ERP sync & IFRS compliance",
      exportPdf: "Export Audit PDF",
      uploadExcel: "Upload Data Excel / CSV",
      systemStatus: "System Status: Active & Stable",
      cfoAdvisor: "CFO AI Assistant",
      analytics: "Analytics Dashboard",
      creditScoring: "Credit Scoring Engine",
      marketplace: "Auditors Marketplace",
      cashFlow: "Cash Flow Audit",
      alerts: "Real-Time Alerts",
      erpSync: "ERP Gateway",
      languageBtn: "عربي"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ar',
  fallbackLng: 'ar',
  interpolation: { escapeValue: false }
});

export default i18n;