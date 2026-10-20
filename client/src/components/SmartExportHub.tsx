import React, { useState } from 'react';
import * as XLSX from 'xlsx';

export default function SmartExportHub() {
  const [selectedSqlSource, setSelectedSqlSource] = useState<string>('vw_IAS1_FinancialPresentation');
  const [exportFormat, setExportFormat] = useState<string>('Excel (.xlsx)');

  // عينة من البيانات الواردة من استعلامات الـ SQL للتقارير الفورية
  const sampleQueryData = [
    { AccountCode: '1010', AccountName: 'النقدية وما في حكمها', Balance: 1500000, Period: '2026-10', Status: 'مطابق' },
    { AccountCode: '1210', AccountName: 'الذمم المدينة (العملاء)', Balance: 320000, Period: '2026-10', Status: 'مفحوص' },
    { AccountCode: '2010', AccountName: 'الذمم الدائنة (الموردين)', Balance: 240000, Period: '2026-10', Status: 'مفحوص' },
    { AccountCode: '3010', AccountName: 'رأس المال', Balance: 5000000, Period: '2026-10', Status: 'معتمد' },
    { AccountCode: '4010', AccountName: 'إيرادات المبيعات', Balance: 1500000, Period: '2026-10', Status: 'نشط' }
  ];

  const handleExportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(sampleQueryData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "SQL_Report_Export");
      
      // تصدير الملف محلياً
      XLSX.writeFile(workbook, `SAEIS_${selectedSqlSource}_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
      alert(`تم بنجاح تصدير تقرير استعلام (${selectedSqlSource}) إلى ملف Excel فوري.`);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء عملية التصدير لملف الـ Excel.');
    }
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المركز */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            محرك التصدير الذكي لاستعلامات SQL (Smart SQL-to-Excel Export Engine)
          </h2>
          <p className="text-xs text-slate-400">
            ربط مباشر بين Views وقواعد البيانات واستخراج التقارير الفورية بصيغة Excel.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          محرك التصدير نشط
        </span>
      </div>

      {/* خيارات التصدير والمعاينة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            إعدادات مصدر البيانات والتنسيق
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-bold">اختر استعلام / View المصدر:</label>
            <select
              value={selectedSqlSource}
              onChange={(e) => setSelectedSqlSource(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="vw_IAS1_FinancialPresentation">vw_IAS1_FinancialPresentation (قائمة المركز المالي)</option>
              <option value="vw_IAS2_InventoryValuation">vw_IAS2_InventoryValuation (تقييم المخزون والمخصصات)</option>
              <option value="vw_IAS16_PPE_Depreciation">vw_IAS16_PPE_Depreciation (إهلاك الأصول الثابتة)</option>
              <option value="vw_IFRS9_ECL_Calculation">vw_IFRS9_ECL_Calculation (نموذج الخسائر الائتمانية IFRS 9)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-bold">تنسيق ملف التصدير:</label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Excel (.xlsx)">Excel (.xlsx)</option>
              <option value="CSV (.csv)">CSV (.csv)</option>
            </select>
          </div>
          <button
            onClick={handleExportToExcel}
            className="mt-3 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>تصدير التقرير الفوري لـ Excel</span>
          </button>
        </div>

        {/* جدول معاينة البيانات */}
        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            معاينة نتائج الاستعلام قبل التصدير (Live SQL Preview)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  <th className="p-2.5 border border-slate-800 text-right">رقم الحساب</th>
                  <th className="p-2.5 border border-slate-800 text-right">اسم الحساب البيان</th>
                  <th className="p-2.5 border border-slate-800 text-right">الرصيد</th>
                  <th className="p-2.5 border border-slate-800 text-right">الفترة</th>
                  <th className="p-2.5 border border-slate-800 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="text-slate-200 font-mono">
                {sampleQueryData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="p-2.5 border border-slate-800 text-amber-400 font-bold">{row.AccountCode}</td>
                    <td className="p-2.5 border border-slate-800 font-sans">{row.AccountName}</td>
                    <td className="p-2.5 border border-slate-800 text-emerald-400">${row.Balance.toLocaleString()}</td>
                    <td className="p-2.5 border border-slate-800 text-slate-400">{row.Period}</td>
                    <td className="p-2.5 border border-slate-800 text-center">
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold">
                        {row.Status}
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
  );
}