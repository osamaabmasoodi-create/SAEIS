import React, { useState } from 'react';
import ErpConnector from './components/ErpConnector';
import ERPUploadDialog from './components/ERPUploadDialog';
import CorrectionEngine from './components/CorrectionEngine';
import Ias2NrvViewer from './components/Ias2NrvViewer';
import CFOAdvisorView from './components/CFOAdvisorView';
import SqlViewer from './components/SqlViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [auditData, setAuditData] = useState<any[]>([]);

  // دالة لمعالجة وتخزين البيانات الضخمة (مثل 25,000 سطر أو حساب فأكثر) بكفاءة عالية
  const handleDataLoaded = (data: any[]) => {
    if (Array.isArray(data)) {
      setAuditData(data);
      console.log(`تم تحميل ومعالجة عدد ${data.length} سجل بنجاح في المنظومة.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#1f2937] border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-bold p-2.5 rounded-xl shadow">SAEIS</div>
          <div>
            <h1 className="text-lg font-bold text-white">منظومة SAEIS للتدقيق المالي والربط الذكي</h1>
            <p className="text-xs text-slate-400">منظومة الذكاء الاصطناعي للتدقيق المالي وامتثال معايير التقارير المالية IFRS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition shadow"
          >
            رفع ملف البيانات (Excel / CSV)
          </button>
        </div>
      </header>

      {/* Navigation Tabs - نفس الترتيب والشكل الاحترافي السابق */}
      <nav className="bg-[#1f2937]/60 border-b border-slate-700/60 px-6 py-2 flex gap-2 overflow-x-auto text-sm">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          لوحة التدقيق والتحليل
        </button>
        <button
          onClick={() => setActiveTab('correction')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'correction' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          محرك التصحيح
        </button>
        <button
          onClick={() => setActiveTab('erp')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'erp' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          الربط المباشر (ERP)
        </button>
        <button
          onClick={() => setActiveTab('ifrs')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'ifrs' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          معايير IFRS
        </button>
        <button
          onClick={() => setActiveTab('cfo')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'cfo' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          المستشار الذكي (CFO AI)
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 rounded-lg font-semibold transition ${activeTab === 'sql' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
        >
          استعلامات SQL
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1f2937] border border-slate-700 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400">إجمالي السجلات المفحوصة</p>
                <h3 className="text-2xl font-bold text-white mt-1">
                  {auditData.length > 0 ? auditData.length.toLocaleString() : '100,002'}
                </h3>
              </div>
              <div className="bg-[#1f2937] border border-slate-700 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400">القيود المخالفة</p>
                <h3 className="text-2xl font-bold text-amber-400 mt-1">16 قيداً</h3>
              </div>
              <div className="bg-[#1f2937] border border-slate-700 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400">أثر IFRS 16</p>
                <h3 className="text-2xl font-bold text-indigo-400 mt-1">$120,000</h3>
              </div>
              <div className="bg-[#1f2937] border border-slate-700 p-5 rounded-2xl shadow">
                <p className="text-xs text-slate-400">مخصص IFRS 9</p>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">$18,500</h3>
              </div>
            </div>

            <div className="bg-[#1f2937] border border-slate-700 p-6 rounded-2xl shadow space-y-4">
              <h3 className="text-lg font-bold text-white">ملخص التحفظات المكتشفة وقود التسوية المقترحة</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="pb-3">المعيار الدولي</th>
                      <th className="pb-3">وصف المعالجة الحالية</th>
                      <th className="pb-3">الأثر المالي ($)</th>
                      <th className="pb-3">القيد التصحيحي المقترح</th>
                      <th className="pb-3">حالة الترحيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    <tr>
                      <td className="py-3 font-mono text-indigo-400">IAS 16</td>
                      <td className="py-3">رأسمالة مصاريف صيانة دورية كأصل ثابت بشكل خاطئ</td>
                      <td className="py-3 text-red-400">$25,000</td>
                      <td className="py-3">فصل المبالغ وتحويلها لحساب مصروف الصيانة التشغيلي</td>
                      <td className="py-3"><span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">معلق</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-indigo-400">IFRS 16</td>
                      <td className="py-3">تحميل عقود إيجار التشغيل للمصروف مباشرة بدلاً من أصل ROU</td>
                      <td className="py-3 text-red-400">$120,000</td>
                      <td className="py-3">إثبات أصل حق الاستخدام (ROU Asset) مقابل التزام الإيجار</td>
                      <td className="py-3"><span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">معلق</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 font-mono text-indigo-400">IFRS 9</td>
                      <td className="py-3">عدم احتساب مخصص خسائر ائتمانية متوقعة للذمم المتقادمة</td>
                      <td className="py-3 text-red-400">$18,500</td>
                      <td className="py-3">قيد مصروف الخسائر الئتمانية مقابل مخصص ECL</td>
                      <td className="py-3"><span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs">معلق</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'correction' && <CorrectionEngine />}
        {activeTab === 'erp' && <ErpConnector />}
        {activeTab === 'ifrs' && <Ias2NrvViewer />}
        {activeTab === 'cfo' && <CFOAdvisorView />}
        {activeTab === 'sql' && <SqlViewer auditData={auditData} />}
      </main>

      {/* Upload Dialog Modal */}
      <ERPUploadDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleDataLoaded}
      />
    </div>
  );
}