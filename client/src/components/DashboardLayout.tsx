import React, { useState } from 'react';
import { 
  BarChart3, 
  FileCheck, 
  Database, 
  Wrench, 
  Bot, 
  Upload, 
  Layers 
} from 'lucide-react';
import ERPUploadDialog from './ERPUploadDialog';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab = 'cfo',
  setActiveTab
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const navItems = [
    { id: 'cfo', label: 'نقاط التدقيق والتحليل', icon: BarChart3 },
    { id: 'ifrs', label: 'معايير IFRS', icon: FileCheck },
    { id: 'erp', label: 'الربط المباشر (ERP)', icon: Database },
    { id: 'engine', label: 'محرك التصحيح', icon: Wrench },
    { id: 'chat', label: 'المستشار الذكي (CFO AI)', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans dir-rtl">
      {/* الهيدر العلوي الموحد */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* الشعار والاسم */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white font-black tracking-wider shadow-lg shadow-blue-500/20">
                SAEIS
              </div>
              <div>
                <h1 className="text-base font-bold text-white flex items-center gap-2">
                  منظومة SAEIS للتدقيق المالي والربط الذكي
                </h1>
                <p className="text-[11px] text-gray-400">
                  نظام المراجعة الذكية والحسابات الختامية وفق معايير التقرير المالي الدولية IFRS
                </p>
              </div>
            </div>

            {/* أزرار الإجراءات السريعة */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shadow-md shadow-blue-600/20"
              >
                <Upload size={15} />
                رفع ملف البيانات (Excel / CSV)
              </button>
            </div>
          </div>

          {/* شريط التبويبات الرئيسي */}
          {setActiveTab && (
            <div className="flex items-center gap-2 border-t border-gray-800/80 pt-2 pb-1 overflow-x-auto text-xs no-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* نافذة رفع البيانات */}
      <ERPUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
};

export default DashboardLayout;