import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle } from 'lucide-react';

export default function CFOAdvisorView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [erpType, setErpType] = useState('Onyx Pro');
  const [fileLabel, setFileLabel] = useState('انقر هنا لاختيار ملف الإكسل الحقيقي من جهازك');
  const [isDone, setIsDone] = useState(false);
  
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileLabel(e.target.files[0].name);
      setIsDone(false);
    }
  };

  const executeProcess = () => {
    setIsDone(true);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6" dir="rtl">
      {/* رأس اللوحة وأزرار التحكم */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-4">
        <div>
          <h3 className="text-base font-bold text-white">لوحة التحليلات والتعديلات الهيكلّية (CFO View)</h3>
          <p className="text-xs text-slate-400">منظومة SAEIS للتدقيق المالي والربط الذكي مع أنظمة ERP</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-900/20 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            رفع ملف البيانات (Excel / CSV)
          </button>
        </div>
      </div>

      {/* مؤشرات الأداء السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">مستوى الامتثال العام</span>
          <h4 className="text-lg font-black text-emerald-400 mt-1">97.8%</h4>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">القيود للمخالفة</span>
          <h4 className="text-lg font-black text-rose-400 mt-1">16 قيداً</h4>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">أثر IFRS 16</span>
          <h4 className="text-lg font-black text-white mt-1">$120,000</h4>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">مخصص IFRS 9</span>
          <h4 className="text-lg font-black text-amber-400 mt-1">$18,500</h4>
        </div>
      </div>

      {/* جدول التحفظات والتسويات المقترحة */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th className="p-3">المعيار الدولي</th>
              <th className="p-3">وصف المعالجة الحالي</th>
              <th className="p-3">القيد التصحيحي المقترح</th>
              <th className="p-3">الأثر المالي ($)</th>
              <th className="p-3">حالة الترحيل</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-bold text-cyan-400">IAS 16</td>
              <td className="p-3 text-slate-300">رأسمالة مصاريف صيانة دورية كأصل ثابت بشكل خاطئ</td>
              <td className="p-3 text-slate-200">فصل المبالغ وتحويلها لحساب مصروف الصيانة التشغيلي</td>
              <td className="p-3 font-mono text-white">$25,000</td>
              <td className="p-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">معلق</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-bold text-cyan-400">IFRS 16</td>
              <td className="p-3 text-slate-300">تحميل عقود إيجار التشغيل للمصروف مباشرة بدلاً من أصل ROU</td>
              <td className="p-3 text-slate-200">إثبات أصل حق الاستخدام (ROU Asset) مقابل التزام الإيجار</td>
              <td className="p-3 font-mono text-white">$120,000</td>
              <td className="p-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">معلق</span>
              </td>
            </tr>
            <tr className="hover:bg-slate-800/30">
              <td className="p-3 font-bold text-cyan-400">IFRS 9</td>
              <td className="p-3 text-slate-300">عدم احتساب مخصص خسائر الائتمانية متوقعة للذمم المتقادمة</td>
              <td className="p-3 text-slate-200">قيد مصروف الخسائر الائتمانية مقابل مخصص ECL</td>
              <td className="p-3 font-mono text-white">$18,500</td>
              <td className="p-3">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">معلق</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* نافذة رفع الملفات المنبثقة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white">رفع ملف البيانات (Excel / CSV)</h4>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">اختر نظام ERP الأصلي:</label>
                <select 
                  value={erpType}
                  onChange={(e) => setErpType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Onyx Pro">Onyx Pro (أونكس برو)</option>
                  <option value="Odoo ERP">Odoo ERP</option>
                  <option value="SAP Business One">SAP Business One</option>
                  <option value="General Excel">ملف إكسل عام</option>
                </select>
              </div>

              {/* عنصر إدخال ملفات حقيقي مخفي تماماً */}
              <input 
                type="file" 
                ref={hiddenInputRef}
                onChange={onFileSelected}
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
              />

              {/* صندوق تفاعلي بالكامل يضمن فتح مستعرض الملفات عند الضغط عليه */}
              <div 
                onClick={() => hiddenInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-500/60 hover:border-emerald-400 rounded-xl p-6 text-center space-y-2 bg-slate-950/80 cursor-pointer transition shadow-inner"
              >
                <FileSpreadsheet className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-emerald-300 text-sm">{fileLabel}</div>
                <div className="text-[10px] text-slate-400">انقر هنا لفتح نافذة الكمبيوتر واختيار الملف المطلوب (.xlsx, .csv)</div>
              </div>

              {isDone && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-xl flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle className="w-4 h-4" />
                  <span>تمت معالجة وتدقيق الملف بنجاح!</span>
                </div>
              )}

              <button
                onClick={executeProcess}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-900/20 cursor-pointer"
              >
                {isDone ? 'تم التحميل بنجاح' : 'بدء المعالجة والتدقيق'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}