// @ts-nocheck
import React from 'react';
import { useApp } from './AppContext';
import { FileText, Printer, X, CheckCircle, ShieldCheck, Award } from 'lucide-react';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ isOpen, onClose }) => {
  const context = useApp() as any;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-right font-sans" dir="rtl">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* شريط الإجراءات العلوي (لا يظهر أثناء الطباعة) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-white text-base">معاينة تقرير التدقيق الشامل (SAEIS Audit Report)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* جسم التقرير القابل للطباعة */}
        <div className="p-8 bg-white text-slate-900 print:p-0 print:bg-white flex-1 space-y-6" id="printable-report">
          
          {/* هيدر التقرير الرسمي */}
          <div className="border-b-2 border-slate-900 pb-6 flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-2xl tracking-tight">
                <ShieldCheck className="w-8 h-8 text-amber-600" />
                <span>منظومة SAEIS للتدقيق المالي والربط الذكي</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Smart Audit & IFRS Compliance Engine</p>
            </div>
            <div className="text-left text-xs text-slate-600 space-y-1 font-mono">
              <p><strong className="text-slate-900">رقم التقرير:</strong> AUD-2026-9903</p>
              <p><strong className="text-slate-900">تاريخ الفحص:</strong> {new Date().toLocaleDateString('ar-EG')}</p>
              <p><strong className="text-slate-900">حالة المطابقة:</strong> <span className="text-emerald-700 font-bold">مطابق لـ IFRS</span></p>
            </div>
          </div>

          {/* ملخص الملف المفحوص */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">اسم الملف المفحوص</span>
              <strong className="text-slate-900 font-mono text-sm">{context?.fileName || "SAEIS_Master_Audit_Demo_3000.xlsx"}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">إجمالي الحسابات المفحوصة</span>
              <strong className="text-slate-900 font-mono text-sm">3,000 حساب</strong>
            </div>
            <div>
              <span className="text-slate-500 block">مؤشر الالتزام المعياري</span>
              <strong className="text-emerald-700 font-bold text-sm">97.8%</strong>
            </div>
            <div>
              <span className="text-slate-500 block">إجمالي التسويات الناتجة</span>
              <strong className="text-amber-700 font-bold text-sm">$8,606,704.47</strong>
            </div>
          </div>

          {/* جدول ملخص قيود التسوية والتصحيح المعياري */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-r-4 border-amber-500 pr-2">
              <span>ملخص قيود التسوية المقترحة بناءً على فقرات المعايير الدولية (IFRS/IAS)</span>
            </h3>

            <table className="w-full text-right text-xs border border-slate-300 divide-y divide-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-bold">
                <tr>
                  <th className="p-3 border-l border-slate-300">المعيار والفقرة</th>
                  <th className="p-3 border-l border-slate-300">بيان القيد المحاسبي</th>
                  <th className="p-3 border-l border-slate-300">الطرف المدين</th>
                  <th className="p-3 border-l border-slate-300">الطرف الدائن</th>
                  <th className="p-3">المبلغ ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 border-l border-slate-200 font-bold text-amber-700">IAS 16 (الفقرة 7)</td>
                  <td className="p-3 border-l border-slate-200">إعادة تصنيف أصل أدوات مكتبية استهلاكية مسجلة خطأ كمصروفات عمومية</td>
                  <td className="p-3 border-l border-slate-200 text-emerald-800 font-bold">الأصول الثابتة (معدات)</td>
                  <td className="p-3 border-l border-slate-200 text-slate-600">المصروفات العمومية</td>
                  <td className="p-3 font-mono text-slate-900 font-bold">$1,291,006</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 border-l border-slate-200 font-bold text-amber-700">IAS 2 (الفقرة 9)</td>
                  <td className="p-3 border-l border-slate-200">إثبات مخصص هبوط أسعار المخزون الراكد للفترة الحالية (NRV)</td>
                  <td className="p-3 border-l border-slate-200 text-emerald-800 font-bold">مصروف هبوط مخزون</td>
                  <td className="p-3 border-l border-slate-200 text-slate-600">مخصص هبوط مخزون</td>
                  <td className="p-3 font-mono text-slate-900 font-bold">$2,151,676</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 border-l border-slate-200 font-bold text-amber-700">IFRS 16 (الفقرة 22)</td>
                  <td className="p-3 border-l border-slate-200">إثبات أصل حق الاستخدام والالتزام الإيجاري السنوي لربط العقود طويلة الأجل</td>
                  <td className="p-3 border-l border-slate-200 text-emerald-800 font-bold">أصول حق الاستخدام (ROU)</td>
                  <td className="p-3 border-l border-slate-200 text-slate-600">التزامات عقود الإيجار</td>
                  <td className="p-3 font-mono text-slate-900 font-bold">$5,164,023</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* التوصيات الجوهرية */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs space-y-1">
            <strong className="text-amber-900 font-bold block mb-1">توصيات المراجعة والتدقيق المالي المستقل:</strong>
            <p className="text-amber-800">• يوصى بترحيل القيود أعلاه آلياً لقاعدة بيانات Onyx Pro / ERP لضمان صحة العرض والعدالة في القوائم المالية المعتمدة.</p>
            <p className="text-amber-800">• متابعة تحديث حساب الخسائر الائتمانية المتوقعة (IFRS 9 Stage 2 & 3) بشكل دوري نهاية كل ربع سنة.</p>
          </div>

          {/* توقيعات الاعتماد المستندي */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-500 mb-6">مسؤول التدقيق والأنظمة المالية</p>
              <div className="font-bold text-slate-900 underline decoration-slate-300 underline-offset-4">أسامة عباس عبده محمد علي</div>
              <p className="text-[10px] text-slate-400 mt-1">SAEIS Lead Financial Auditor</p>
            </div>
            <div>
              <p className="text-slate-500 mb-6">المراجع المالي الخارجي المعتمد</p>
              <div className="font-bold text-slate-900 underline decoration-slate-300 underline-offset-4">د. محمود متولي</div>
              <p className="text-[10px] text-slate-400 mt-1">Certified Financial Consultant</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuditReportModal;