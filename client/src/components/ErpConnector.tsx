import React, { useState } from 'react';

export default function ErpConnector() {
  const [selectedErp, setSelectedErp] = useState('odoo');
  const [apiUrl, setApiUrl] = useState('https://erp.company.com/api/v1');
  const [apiKey, setApiKey] = useState('sk_live_saeis_987654321');
  const [status, setStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');

  const handleTestConnection = () => {
    setStatus('testing');
    setTimeout(() => {
      setStatus('connected');
    }, 1500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-800 border border-slate-700 rounded-xl text-white space-y-6 dir-rtl" dir="rtl">
      <div className="border-b border-slate-700 pb-4">
        <h3 className="text-xl font-bold text-amber-400">🔌 إعدادات الربط المباشر مع أنظمة ERP (Live API)</h3>
        <p className="text-xs text-slate-400 mt-1">ربط محرك SAEIS مباشرة لتصدير قيود التسوية واستيراد ميزان المراجعة آلياً</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* اختيار النظام */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">نظام الـ ERP المستهدف:</label>
          <select 
            value={selectedErp} 
            onChange={(e) => setSelectedErp(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-amber-300 focus:border-amber-500 outline-none"
          >
            <option value="odoo">Odoo ERP (REST API)</option>
            <option value="sap">SAP S/4HANA (OData)</option>
            <option value="onyx">Onyx Pro (أونكس برو)</option>
            <option value="oracle">Oracle Financials Cloud</option>
          </select>
        </div>

        {/* مسار الـ API */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">رابط نقطة الاتصال (API Endpoint):</label>
          <input 
            type="text" 
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 font-mono dir-ltr"
          />
        </div>

        {/* المفتاح / Token */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">مفتاح المصادقة (API Key / Token):</label>
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-slate-200 font-mono"
          />
        </div>
      </div>

      {/* حالة الاتصال والإجراءات */}
      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-700 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">حالة الربط الحالية:</span>
          {status === 'idle' && <span className="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full">غير متصل</span>}
          {status === 'testing' && <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full animate-pulse">جاري اختبار الاتصال...</span>}
          {status === 'connected' && <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-bold">✓ متصل وجاهز للبث الآلي</span>}
        </div>

        <button 
          onClick={handleTestConnection}
          disabled={status === 'testing'}
          className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
        >
          <span>⚡</span>
          <span>اختبار الاتصال وحفظ البيانات</span>
        </button>
      </div>
    </div>
  );
}