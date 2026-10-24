import React, { useState } from 'react';

interface WorkingPaper {
  id: number;
  entryRef: string;
  documentName: string;
  category: 'فاتورة ضريبية' | 'عقد إيجار' | 'كشف مطابقة بنكية' | 'مستند تسوية أصول';
  fileSize: string;
  uploadDate: string;
  status: 'جاهز للمراجع الخارجي' | 'معتمد للزكاة' | 'تحت المراجعة';
}

export default function DigitalAuditVault() {
  const [papers, setPapers] = useState<WorkingPaper[]>([
    { id: 1, entryRef: 'JE-2026-1044', documentName: 'Invoice_Maintenance_7500.pdf', category: 'فاتورة ضريبية', fileSize: '2.4 MB', uploadDate: '2026-10-22', status: 'جاهز للمراجع الخارجي' },
    { id: 2, entryRef: 'JE-2026-0982', documentName: 'Lease_Contract_IFRS16.pdf', category: 'عقد إيجار', fileSize: '4.1 MB', uploadDate: '2026-10-20', status: 'معتمد للزكاة' },
    { id: 3, entryRef: 'JE-2026-9012', documentName: 'Bank_Rec_October.xlsx', category: 'كشف مطابقة بنكية', fileSize: '1.8 MB', uploadDate: '2026-10-23', status: 'تحت المراجعة' }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <div className="flex flex-col gap-6 text-right font-sans h-full bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl" dir="rtl">
      
      {/* رأس الشاشة */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
            📁 أرشيف أوراق العمل الجنائية الرقمية (Digital Audit Working Papers Vault)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مخزن سحابي آمن يربط كل قيد تسوية أو ملاحظة تدقيق بمستندها الأصلي لضمان الجاهزية القصوى للمراجعين وهيئة الزكاة.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => alert('تم فتح نافذة رفع وتشفير المستندات الثبوتية الجديدة بنجاح.')}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center gap-1.5"
          >
            📤 إرفاق مستند جديد
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1.5 rounded-xl font-bold">
            الأرشيف مؤمن (AES-256)
          </span>
        </div>
      </div>

      {/* المؤشرات التلخيصية السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
          <span className="text-xs text-slate-400 font-bold">إجمالي المستندات المؤرشفة</span>
          <span className="text-2xl font-extrabold text-white font-mono my-2">142 ملف</span>
          <span className="text-[10px] text-emerald-400">مربوطة آلياً بقيود الـ ERP</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
          <span className="text-xs text-slate-400 font-bold">جاهزية الملف للزكاة والدخل</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono my-2">98%</span>
          <span className="text-[10px] text-emerald-400">كافة المستندات الإلزامية مرفقة</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-xl">
          <span className="text-xs text-slate-400 font-bold">حجم التخزين المشفر</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono my-2">410 MB</span>
          <span className="text-[10px] text-amber-400">تخزين سحابي محلي/خاص</span>
        </div>
      </div>

      {/* جدول أوراق العمل والمستندات */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200">سجل مستندات أوراق العمل والربط القيدي</h3>
          <div className="flex gap-2 text-xs items-center">
            <span className="text-slate-400">فلترة المستندات:</span>
            <select 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs"
            >
              <option value="all">جميع الفئات</option>
              <option value="invoice">فواتير ضريبية</option>
              <option value="contract">عقود إيجار</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 text-[11px]">
                <th className="p-3 text-right border border-slate-800">رقم القيد المرتبط (ERP)</th>
                <th className="p-3 text-right border border-slate-800">اسم الملف الثبوتي</th>
                <th className="p-3 text-right border border-slate-800">فئة المستند</th>
                <th className="p-3 text-right border border-slate-800">حجم الملف والتاريخ</th>
                <th className="p-3 text-center border border-slate-800">حالة الاعتماد</th>
                <th className="p-3 text-center border border-slate-800">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-200">
              {papers.map((paper) => (
                <tr key={paper.id} className="hover:bg-slate-950/50 transition">
                  <td className="p-3 border border-slate-800 font-mono text-amber-400 font-bold">{paper.entryRef}</td>
                  <td className="p-3 border border-slate-800 flex items-center gap-2">
                    <span>📄</span>
                    <span className="text-white font-medium">{paper.documentName}</span>
                  </td>
                  <td className="p-3 border border-slate-800 text-slate-300">{paper.category}</td>
                  <td className="p-3 border border-slate-800 text-slate-400 font-mono">
                    <div>{paper.fileSize}</div>
                    <div className="text-[10px]">{paper.uploadDate}</div>
                  </td>
                  <td className="p-3 border border-slate-800 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      paper.status === 'معتمد للزكاة' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      paper.status === 'جاهز للمراجع الخارجي' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {paper.status}
                    </span>
                  </td>
                  <td className="p-3 border border-slate-800 text-center">
                    <button 
                      onClick={() => alert(`جاري معاينة المستند: ${paper.documentName}`)}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition shadow"
                    >
                      👁️ معاينة المستند
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}