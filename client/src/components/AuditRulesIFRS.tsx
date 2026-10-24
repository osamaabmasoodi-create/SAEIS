import React, { useState } from 'react';

interface StandardRule {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  sqlView: string;
  isActive: boolean;
  complianceRate: string;
}

export default function AuditRulesIFRS() {
  const [standards, setStandards] = useState<StandardRule[]>([
    {
      id: 'ias1',
      code: 'IAS 1',
      name: 'عرض القوائم المالية (Presentation of Financial Statements)',
      category: 'معايير العرض والأداء',
      description: 'فحص وتوليد قائمة المركز المالي، قائمة الدخل، والتغييرات في حقوق الملكية وفق المعايير الدولية.',
      sqlView: 'CREATE VIEW vw_IAS1 AS SELECT * FROM GeneralLedger WHERE Approved = 1;',
      isActive: true,
      complianceRate: '98%'
    },
    {
      id: 'ias2',
      code: 'IAS 2',
      name: 'المخزون (Inventories & Stock Valuation)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'قياس المخزون بالتكلفة أو صافي القيمة القابلة للتحقق أيهما أقل، والتحقق من مخصصات الهبوط.',
      sqlView: 'CREATE VIEW vw_IAS2 AS SELECT ItemCode, Cost, NRV FROM Inventory WHERE Cost > NRV;',
      isActive: true,
      complianceRate: '94%'
    },
    {
      id: 'ias16',
      code: 'IAS 16',
      name: 'الممتلكات والآلات والمعدات (Property, Plant and Equipment)',
      category: 'الأصول الثابتة',
      description: 'تدقيق الإهلاك المتراكم، رسملة المصروفات الرأسمالية، واختبارات إعادة التقييم للأصول الثابتة.',
      sqlView: 'CREATE VIEW vw_IAS16 AS SELECT AssetID, Cost, Depr FROM FixedAssets;',
      isActive: true,
      complianceRate: '97%'
    },
    {
      id: 'ifrs9',
      code: 'IFRS 9',
      name: 'الأدوات المالية وخسائر الائتمان (Financial Instruments ECL)',
      category: 'الإيرادات والأدوات المالية',
      description: 'تطبيق نموذج الخسائر الائتمانية المتوقعة (Expected Credit Loss - ECL) على محفظة العملاء.',
      sqlView: 'CREATE VIEW vw_IFRS9 AS SELECT CustomerID, Exposure, LossRate FROM Receivables;',
      isActive: false,
      complianceRate: '95%'
    },
    {
      id: 'ifrs16',
      code: 'IFRS 16',
      name: 'عقود الإيجار (Leases & ROU Assets)',
      category: 'الأصول والالتزامات التشغيلية',
      description: 'معالجة أصول حق الاستخدام (Right-of-Use) والالتزامات الإيجارية وحسم التدفقات.',
      sqlView: 'CREATE VIEW vw_IFRS16 AS SELECT LeaseID, AnnualRent, PV_Factor FROM Leases;',
      isActive: false,
      complianceRate: '93%'
    }
  ]);

  const [selectedStandardId, setSelectedStandardId] = useState<string>('ias1');

  // تبديل حالة التفعيل (تشغيل / إيقاف) للمعيار
  const toggleStandardStatus = (id: string) => {
    setStandards(prev =>
      prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item)
    );
  };

  const currentStandard = standards.find(s => s.id === selectedStandardId) || standards[0];

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl" dir="rtl">
      {/* رأس المحرك */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">محرك قواعد وفحص المعايير الدولية (IFRS & IAS Audit Engine)</h2>
          <p className="text-xs text-slate-400">تفعيل أو إيقاف المعايير المحاسبية المخصصة لطبيعة نشاط الشركة لضمان دقة التقارير الرقابية.</p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          المعايير النشطة: {standards.filter(s => s.isActive).length} من {standards.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* قائمة المعايير مع أزرار الـ Toggle */}
        <div className="lg:col-span-1 bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">قائمة المعايير الدولية</h3>
          {standards.map(std => (
            <div
              key={std.id}
              onClick={() => setSelectedStandardId(std.id)}
              className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                selectedStandardId === std.id
                  ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-extrabold">{std.code}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${std.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    {std.isActive ? 'نشط للفحص' : 'متوقف'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 truncate">{std.name}</span>
              </div>

              {/* زر التشغيل والإيقاف (Toggle Switch) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStandardStatus(std.id);
                }}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition duration-300 ml-2 ${
                  std.isActive ? 'bg-emerald-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
                title={std.isActive ? "تعطيل المعيار" : "تفعيل المعيار"}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300"></div>
              </button>
            </div>
          ))}
        </div>

        {/* تفاصيل المعيار المختار */}
        <div className="lg:col-span-2 bg-slate-900/40 p-5 rounded-xl border border-slate-800 flex flex-col justify-between gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  {currentStandard.category}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  {currentStandard.code}: {currentStandard.name}
                </h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${currentStandard.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                {currentStandard.isActive ? 'الحالة: مفعل للتدقيق' : 'الحالة: معطل'}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold text-slate-300">وصف المعيار ونطاق المعالجة المحاسبية:</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                {currentStandard.description}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold text-slate-300">استعلام الفحص المرتبط بقاعدة البيانات (SQL View - Read-Only):</h4>
              <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl font-mono text-[11px] text-amber-400 overflow-x-auto">
                {currentStandard.sqlView}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <span className="text-xs text-slate-400">نسبة الامتثال الحالية: <b className="text-emerald-400">{currentStandard.complianceRate}</b></span>
            <button
              onClick={() => alert(`تم بدء فحص الامتثال الآلي للمعيار ${currentStandard.code}`)}
              disabled={!currentStandard.isActive}
              className={`font-bold px-5 py-2.5 rounded-xl text-xs transition shadow-lg ${
                currentStandard.isActive 
                  ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {currentStandard.isActive ? 'تشغيل فحص الامتثال لهذا المعيار' : 'المعيار معطل (قم بتفعيله أولاً)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}