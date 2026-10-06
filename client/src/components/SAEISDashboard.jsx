import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Database, 
  FileSpreadsheet, 
  ShieldCheck, 
  Server, 
  BarChart3, 
  Download, 
  AlertTriangle,
  CheckCircle2,
  Play,
  Table
} from 'lucide-react';

export default function SAEISDashboard() {
  const [activeTab, setActiveTab] = useState('compliance');
  const [selectedStandard, setSelectedStandard] = useState('ias36');
  const [queryResult, setQueryResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // بيانات واختبارات المعايير مع نتائجها الوهمية الجاهزة للعرض الفوري
  const standardsData = {
    ias36: {
      code: "IAS 36",
      title: "اضمحلال قيمة الأصول (Impairment of Assets)",
      description: "اختبارات الهبوط والانخفاض في القيمة عندما تزيد القيمة الدفترية للأصل عن قيمته القابلة للاسترداد.",
      sqlQuery: `SELECT AssetID, CarryingAmount, RecoverableAmount, 
CASE WHEN CarryingAmount > RecoverableAmount THEN 'Impaired' ELSE 'Safe' END AS ImpairmentStatus 
FROM Assets;`,
      results: [
        { id: "AST-101", name: "ماكينة خط الإنتاج الرئيسي", carrying: "$45,000", recoverable: "$40,000", status: "مضمحل (Impaired)", flag: "warning" },
        { id: "AST-102", name: "أجهزة حاسوب الإدارة", carrying: "$12,000", recoverable: "$13,500", status: "سليم (Safe)", flag: "success" },
        { id: "AST-103", name: "سيارات التوزيع والتوصيل", carrying: "$28,000", recoverable: "$25,000", status: "مضمحل (Impaired)", flag: "warning" },
      ]
    },
    ias2: {
      code: "IAS 2",
      title: "المخزون (Inventory Valuation)",
      description: "فحص تقييم تكلفة المخزون وصافي قيمته القابلة للتحقق.",
      sqlQuery: `SELECT ItemCode, ItemName, Cost, NetRealizableValue 
FROM Inventory WHERE Cost > NetRealizableValue;`,
      results: [
        { id: "INV-501", name: "إطارات سيارات مقاس 16", carrying: "$8,500", recoverable: "$9,000", status: "سليم (Safe)", flag: "success" },
        { id: "INV-502", name: "قطع غيار قديمة", carrying: "$3,200", recoverable: "$2,100", status: "انخفاض قيمة (Impaired)", flag: "warning" },
      ]
    }
  };

  const handleRunAudit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setQueryResult(standardsData[selectedStandard].results);
      setIsLoading(false);
    }, 400); // محاكاة وقت جلب البيانات من قاعدة البيانات
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* شريط التنقل العلوي */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-xl font-bold tracking-wide">منصة SAEIS للتدقيق المالي والربط الذكي بالـ ERP</h1>
            <p className="text-xs text-slate-400">Smart Audit & ERP Integration System - الإصدار المتقدم</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow">
            <Download className="w-4 h-4" />
            تصدير تقرير التدقيق PDF
          </button>
        </div>
      </header>

      {/* الأقسام الرئيسية */}
      <nav className="bg-slate-800/60 border-b border-slate-700 px-6 flex gap-2 overflow-x-auto py-2">
        <button 
          onClick={() => setActiveTab('compliance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${activeTab === 'compliance' ? 'bg-emerald-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          فحص المعايير ومحرك التدقيق
        </button>
      </nav>

      {/* المحتوى */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-emerald-400">محرك الفحص والامتثال الآلي للمعايير الدولية</h3>
              <p className="text-sm text-slate-400 mt-1">اضغط على زر التشغيل أدناه لجلب نتائج الفحص الفعلي وعرضها في جدول بيانات مباشر.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setSelectedStandard('ias36'); setQueryResult(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedStandard === 'ias36' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                IAS 36
              </button>
              <button 
                onClick={() => { setSelectedStandard('ias2'); setQueryResult(null); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${selectedStandard === 'ias2' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}
              >
                IAS 2
              </button>
            </div>
          </div>

          {/* صندوق عرض تفاصيل المعيار المختار */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 space-y-3">
            <h4 className="font-bold text-slate-200">{standardsData[selectedStandard].code}: {standardsData[selectedStandard].title}</h4>
            <p className="text-xs text-slate-400">{standardsData[selectedStandard].description}</p>
            
            <div className="pt-2">
              <span className="text-xs text-slate-500 block mb-1">استعلام الـ SQL المرتبط:</span>
              <code className="block bg-slate-950 p-2.5 rounded text-xs text-emerald-300 font-mono overflow-x-auto">
                {standardsData[selectedStandard].sqlQuery}
              </code>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={handleRunAudit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow"
              >
                <Play className="w-4 h-4" />
                {isLoading ? 'جاري الفحص واستخراج النتائج...' : 'تشغيل فحص الامتثال الآلي لهذا المعيار'}
              </button>
            </div>
          </div>

          {/* منطقة عرض النتائج في جدول حقيقي بدلاً من الـ alert */}
          {queryResult && (
            <div className="bg-slate-900 rounded-xl border border-emerald-500/40 p-4 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <Table className="w-4 h-4" />
                نتائج فحص قاعدة البيانات لـ {standardsData[selectedStandard].code}:
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-800 text-slate-400 border-b border-slate-700">
                      <th className="p-3">الكود / الرقم</th>
                      <th className="p-3">اسم البند أو الأصل</th>
                      <th className="p-3">القيمة الدفترية</th>
                      <th className="p-3">القيمة القابلة للاسترداد</th>
                      <th className="p-3">حالة التطابق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono text-emerald-300">{row.id}</td>
                        <td className="p-3 font-medium text-slate-200">{row.name}</td>
                        <td className="p-3 text-slate-300">{row.carrying}</td>
                        <td className="p-3 text-slate-300">{row.recoverable}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${row.flag === 'warning' ? 'bg-amber-900/50 text-amber-400 border border-amber-700' : 'bg-emerald-900/50 text-emerald-400 border border-emerald-700'}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}