import React, { useState } from 'react';

interface SyncEntry {
  id: number;
  standard: string;
  description: string;
  amount: number;
  erpSystem: string;
  status: 'معلق' | 'قيد المزامنة' | 'تم الترحيل بنجاح' | 'فشل الاتصال';
}

export default function BatchErpSyncHub() {
  const [selectedSystem, setSelectedSystem] = useState<string>('Onyx Pro (أونكس برو)');
  const [entries, setEntries] = useState<SyncEntry[]>([
    { id: 1, standard: 'IAS 16', description: 'إعادة تصنيف أصل أدوات مكتبية استهلاكية', amount: 7500, erpSystem: 'Onyx Pro', status: 'معلق' },
    { id: 2, standard: 'IAS 2', description: 'إثبات مخصص هبوط أسعار المخزون الراكد', amount: 18500, erpSystem: 'Onyx Pro', status: 'معلق' },
    { id: 3, standard: 'IFRS 16', description: 'إثبات أصل حق الاستخدام والالتزام الإيجاري', amount: 45000, erpSystem: 'Onyx Pro', status: 'معلق' },
    { id: 4, standard: 'IFRS 9', description: 'تكوين مخصص الخسائر الائتمانية المتوقعة ECL', amount: 12400, erpSystem: 'Onyx Pro', status: 'معلق' }
  ]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // تحديث نظام ERP لكل القيود أو قيد محدد
  const handleSystemChange = (system: string) => {
    setSelectedSystem(system);
    setEntries(prev => prev.map(e => ({ ...e, erpSystem: system })));
  };

  // ترحيل دفعة القيود (Batch Sync)
  const handleBatchSync = () => {
    setIsSyncing(true);
    
    // تحويل الحالة إلى قيد المزامنة
    setEntries(prev => prev.map(e => ({ ...e, status: 'قيد المزامنة' })));

    setTimeout(() => {
      setEntries(prev => prev.map(e => ({ ...e, status: 'تم الترحيل بنجاح' })));
      setIsSyncing(false);
      alert(`تمت مزامنة وترحيل كافة قيود التسوية (${entries.length} قيود) بنجاح إلى نظام ${selectedSystem} عبر الـ API المشفر!`);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      {/* رأس المركز */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            مركز ربط وتصدير قيود التسوية الآلية للـ ERP (Batch ERP Synchronization Hub)
          </h2>
          <p className="text-xs text-slate-400">
            مزامنة وترحيل قيود التسوية المعيارية دفعة واحدة (Batch Sync) عبر الـ API المشفر مع تتبع الحالة اللحظية.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          بوابة آمنة نشطة
        </span>
      </div>

      {/* لوحة التحكم وإعدادات النظام المستهدف */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs text-slate-300 font-bold whitespace-nowrap">النظام المحاسبي المستهدف:</label>
          <select
            value={selectedSystem}
            onChange={(e) => handleSystemChange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-bold"
          >
            <option value="Onyx Pro (أونكس برو)">Onyx Pro (أونكس برو)</option>
            <option value="Odoo ERP">Odoo ERP</option>
            <option value="SAP Business One">SAP Business One</option>
            <option value="يمن سوفت (Yemen Soft)">يمن سوفت (Yemen Soft)</option>
          </select>
        </div>

        <button
          onClick={handleBatchSync}
          disabled={isSyncing || entries.every(e => e.status === 'تم الترحيل بنجاح')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-lg flex items-center gap-2 ${
            isSyncing || entries.every(e => e.status === 'تم الترحيل بنجاح')
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 text-white'
          }`}
        >
          <span>{isSyncing ? 'جاري المزامنة والترحيل الجماعي...' : '🚀 تنفيذ الترحيل الجماعي للدفعة (Batch Sync)'}</span>
        </button>
      </div>

      {/* جدول القيود وحالة التتبع */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-3">
        <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
          متابعة حالة المزامنة والترحيل لكل قيد معبأ
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-900 text-slate-300">
                <th className="p-3 text-right border border-slate-800">م</th>
                <th className="p-3 text-right border border-slate-800">المعيار الدولي</th>
                <th className="p-3 text-right border border-slate-800">وصف قيد التسوية المحاسبية</th>
                <th className="p-3 text-right border border-slate-800">المبلغ ($)</th>
                <th className="p-3 text-right border border-slate-800">نظام ERP المستهدف</th>
                <th className="p-3 text-center border border-slate-800">حالة التصدير والمزامنة</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {entries.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 border border-slate-800 font-bold text-amber-400">{idx + 1}</td>
                  <td className="p-3 border border-slate-800 font-bold">{item.standard}</td>
                  <td className="p-3 border border-slate-800">{item.description}</td>
                  <td className="p-3 border border-slate-800 font-mono text-white">${item.amount.toLocaleString()}</td>
                  <td className="p-3 border border-slate-800 text-amber-300">{item.erpSystem}</td>
                  <td className="p-3 border border-slate-800 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      item.status === 'تم الترحيل بنجاح' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      item.status === 'قيد المزامنة' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.status}
                    </span>
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