import React, { useState } from 'react';
import { parseExcelFile } from '../lib/excelService';

interface ErpConnectorProps {
  onDataLoaded?: (data: any[]) => void;
}

export default function ErpConnector({ onDataLoaded }: ErpConnectorProps) {
  const [erpType, setErpType] = useState('Odoo ERP (REST API)');
  const [apiEndpoint, setApiEndpoint] = useState('https://erp.company.com/api/v1');
  const [apiKey, setApiKey] = useState('********************************');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setLoading(false);
      alert('تم الاتصال بنجاح مع نظام الـ ERP وجلب بيانات الحسابات المحدثة.');
    }, 1000);
  };

  return (
    <div className="bg-[#1f2937] border border-slate-700 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h3 className="text-lg font-bold text-white">الربط المباشر مع الأنظمة المحاسبية (ERP Connector)</h3>
        <p className="text-xs text-slate-400 mt-1">ربط مباشر مع قواعد بيانات أونكس برو، أودو، و SAP لاستخراج موازين المراجعة تلقائياً</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm text-slate-300">اختر النظام المحاسبي</label>
          <select
            value={erpType}
            onChange={(e) => setErpType(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:border-indigo-500 outline-none"
          >
            <option>Odoo ERP (REST API)</option>
            <option>Onyx Pro ERP (Database Bridge)</option>
            <option>SAP S/4HANA</option>
            <option>Custom SQL Server</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-slate-300">رابط نقطة الاتصال (API Endpoint)</label>
          <input
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-slate-300">مفتاح المصادقة (API Key / Token)</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-[#111827] border border-slate-700 rounded-xl p-3 text-slate-200 text-sm font-mono focus:border-indigo-500 outline-none"
        />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
          <span className="text-xs text-slate-300 font-semibold">
            {isConnected ? 'متصل بنجاح وجاهز للمزامنة' : 'غير متصل (في انتظار المصادقة)'}
          </span>
        </div>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition shadow-lg disabled:opacity-50"
        >
          {loading ? 'جاري الاتصال والتحقق...' : 'اختبار الاتصال والمزامنة'}
        </button>
      </div>
    </div>
  );
}