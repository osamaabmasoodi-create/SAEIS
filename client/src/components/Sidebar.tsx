import React from 'react';
import { 
  FaChartLine, 
  FaShieldAlt, 
  FaSync, 
  FaDatabase, 
  FaFileAlt, 
  FaHdd, 
  FaCalculator, 
  FaBalanceScale,
  FaFileInvoice,
  FaArchive,
  FaChartPie,
  FaChartBar,
  FaStore,
  FaMoneyBillWave,
  FaBell,
  FaPercent,
  FaCode,
  FaServer,
  FaFileExcel,
  FaCheckCircle,
  FaSlidersH,
  FaKey,
  FaUserTie,
  FaBook,
  FaTools,
  FaExchangeAlt,
  FaLayerGroup
} from 'react-icons/fa';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  // المحركات والتبويبات الـ 32 كاملة للمنظومة
  const menuItems = [
    { id: 'executive_board', label: 'لوحة القيادة التنفيذية', Icon: FaChartLine },
    { id: 'ghost_invoices', label: 'كشف الفواتير المزدوجة والمهمة', Icon: FaFileInvoice },
    { id: 'audit_vault', label: 'أرشيف أوراق العمل', Icon: FaArchive },
    { id: 'ratios_analyzer', label: 'تحليل النسب والسيولة', Icon: FaChartPie },
    { id: 'ifrs9_ecl', label: 'محرك معايير IFRS 9 و ECL', Icon: FaCalculator },
    { id: 'analytics', label: 'التحليلات المالية المتقدمة', Icon: FaChartBar },
    { id: 'credit', label: 'نموذج التقييم الائتماني', Icon: FaPercent },
    { id: 'marketplace', label: 'سوق المدققين المستقلين', Icon: FaStore },
    { id: 'cashflow', label: 'المحرك التنبؤي للتدفقات النقدية', Icon: FaMoneyBillWave },
    { id: 'alerts', label: 'مركز التنبيهات الفورية', Icon: FaBell },
    { id: 'tax_fraud', label: 'الضرائب والزكاة وشبهات الاحتيال', Icon: FaShieldAlt },
    { id: 'fraud_room', label: 'غرفة اكتشاف الاحتيال الجنائي', Icon: FaLayerGroup },
    { id: 'batch_sync', label: 'مركز المزامنة والترحيل ERP', Icon: FaSync },
    { id: 'sql_hub', label: 'قاعدة بيانات SQL المباشرة', Icon: FaDatabase },
    { id: 'sp_hub', label: 'إجراءات SQL المخزنة (SP)', Icon: FaServer },
    { id: 'backup_hub', label: 'النسخ الاحتياطي التلقائي', Icon: FaHdd },
    { id: 'smart_export', label: 'التصدير الذكي لـ Excel', Icon: FaFileExcel },
    { id: 'bank_rec', label: 'المطابقة البنكية الآلية', Icon: FaCheckCircle },
    { id: 'kpi_dashboard', label: 'مؤشرات الأداء المالي (KPIs)', Icon: FaChartLine },
    { id: 'kpi_charts', label: 'تحليل الاتجاهات المالية', Icon: FaChartBar },
    { id: 'gov_reports', label: 'تقارير الحوكمة والامتثال', Icon: FaFileAlt },
    { id: 'fraud_risk', label: 'مصفوفة مخاطر الاحتيال', Icon: FaShieldAlt },
    { id: 'variance_hub', label: 'تحليل التباين والمقارنة', Icon: FaBalanceScale },
    { id: 'adjustments', label: 'قيود التسوية والاصحيح الآلي', Icon: FaExchangeAlt },
    { id: 'ifrs_engine', label: 'محرك معايير IFRS الشامل', Icon: FaBook },
    { id: 'ifrs16', label: 'محرك عقود الإيجار IFRS 16', Icon: FaCalculator },
    { id: 'correction', label: 'محرك التصحيح المحاسبي', Icon: FaTools },
    { id: 'ifrs', label: 'قواعد الفحص المعياري', Icon: FaBook },
    { id: 'sql', label: 'استعلامات SQL المتقدمة', Icon: FaCode },
    { id: 'simulator', label: 'محاكي السيناريوهات والصدمات', Icon: FaSlidersH },
    { id: 'erp', label: 'إعدادات الربط وتشفير التوكن', Icon: FaKey },
    { id: 'cfo', label: 'مستشار الإدارة المالية CFO', Icon: FaUserTie },
  ];

  return (
    <aside className="w-72 bg-[#161922] border-l border-gray-800 flex flex-col h-screen fixed right-0 top-0 z-50 text-white shadow-2xl" dir="rtl">
      {/* رأس القائمة الجانبية والشعار */}
      <div className="p-5 border-b border-gray-800 flex items-center gap-3 bg-[#111319] shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-lg shadow-lg">
          S
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-wider text-blue-400">SAEIS</h1>
          <p className="text-[10px] text-gray-400">منظومة التدقيق المالي والربط الذكي</p>
        </div>
      </div>

      {/* روابط التنقل العمودية (تدعم التمرير لعرض جميع المحركات الـ 32) */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.Icon as any;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:bg-[#1e2230] hover:text-white'
              }`}
            >
              <span className="text-sm shrink-0">
                <IconComponent />
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* تذييل القائمة الجانبية (معلومات النظام والمستخدم) */}
      <div className="p-4 border-t border-gray-800 bg-[#111319] text-xs shrink-0">
        <div className="flex items-center justify-between text-gray-400 mb-1">
          <span>المؤسس والرئيس التنفيذي:</span>
        </div>
        <p className="font-bold text-gray-200 truncate">أسامة عباس عبده محمد علي</p>
        <div className="mt-2 text-[10px] text-green-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          32 محرك تدقيق نشط ومتصل بـ ERP
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;