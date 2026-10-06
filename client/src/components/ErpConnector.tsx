import React, { useState } from 'react';

export default function ErpConnector() {
  const [erpSystem, setErpSystem] = useState('onyx');
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);

  // محاكاة الاتصال بنظام الـ ERP
  const handleConnect = () => {
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
      setSyncLogs(prev => ['تم الاتصال بنجاح مع قاعدة بيانات نظام الـ ERP (' + (erpSystem === 'onyx' ? 'Onyx Pro ERP' : 'Odoo ERP') + ')', ...prev]);
    }, 1000);
  };

  // محاكاة مزامنة وفحص القيود
  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncLogs(prev => [
        'تم سحب ومزامنة 100,002 قيد محاسبي بنجاح.',
        'تم تطبيق قواعد الامتثال لمعايير IAS 2, IAS 16, IFRS 9.',
        ...prev
      ]);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 text-right font-sans" dir="rtl">
      {/* رأس قسم الربط */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">الربط المباشر مع الأنظمة المالية (ERP Connector)</h2>
          <p className="text-xs text-slate-400">ربط مباشر مع قواعد بيانات Onyx Pro و Odoo لجلب القيود وفحصها تلقائياً</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
            connectionStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
            connectionStatus === 'connecting' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
          }`}>
            {connectionStatus === 'connected' ? '● متصل بنجاح' : connectionStatus === 'connecting' ? '⌛ جاري الاتصال...' : '○ غير متصل'}
          </span>
        </div>
      </div>

      {/* إعدادات الاتصال واختيار النظام */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-200">اختر نظام الـ ERP المستهدف</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setErpSystem('onyx')}
              className={`p-3 rounded-xl text-xs font-bold border transition ${
                erpSystem === 'onyx' ? 'bg-amber-600 border-amber-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              أونكس برو (Onyx Pro ERP)
            </button>
            <button
              onClick={() => setErpSystem('odoo')}
              className={`p-3 rounded-xl text-xs font-bold border transition ${
                erpSystem === 'odoo' ? 'bg-amber-600 border-amber-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              أودو (Odoo ERP)
            </button>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">سيرفر قاعدة البيانات (Server IP / Host)</label>
              <input type="text" defaultValue="192.168.1.150:1433" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">اسم القاعدة (Database Name)</label>
              <input type="text" defaultValue="Onyx_Financials_2026" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleConnect}
              disabled={connectionStatus === 'connecting'}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 rounded-xl text-xs transition border border-slate-700 shadow"
            >
              اختبار وحفظ الاتصال
            </button>
            <button
              onClick={handleSyncData}
              disabled={connectionStatus !== 'connected' || isSyncing}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-xs transition shadow"
            >
              {isSyncing ? 'جاري المزامنة...' : 'سحب ومزامنة البيانات'}
            </button>
          </div>
        </div>

        {/* سجل الأحداث والمزامنة */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col">
          <h3 className="text-xs font-bold text-slate-200 mb-3">سجل تدفق البيانات والاتصال (Sync & Audit Trail)</h3>
          <div className="flex-1 bg-slate-900 rounded-xl p-3 border border-slate-800 h-56 overflow-y-auto space-y-2 font-mono text-[11px]">
            {syncLogs.length === 0 ? (
              <span className="text-slate-500">في انتظار بدء الاتصال أو المزامنة مع نظام الـ ERP...</span>
            ) : (
              syncLogs.map((log, index) => (
                <div key={index} className="text-emerald-400 border-b border-slate-800/50 pb-1.5">
                  &gt; {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}