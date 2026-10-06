import React, { useState } from 'react';
import SqlViewer from '../components/SqlViewer';
import Ifrs9EclViewer from '../components/Ifrs9EclViewer';
import ErpConnector from '../components/ErpConnector';

export default function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState('tsql');

  return (
    <div className="min-h-screen bg-[#111827] text-slate-100 flex flex-col font-sans" dir="rtl">
      {/* Top Header */}
      <header className="bg-[#1f2937] border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-bold p-2.5 rounded-xl shadow text-sm">SAEIS</div>
          <div>
            <h1 className="text-base font-bold text-white">منظومة SAEIS للتدقيق المالي والربط الذكي</h1>
            <p className="text-[11px] text-slate-400">منظومة الذكاء الاصطناعي للتدقيق المالي وامتثال معايير التقارير المالية IFRS</p>
          </div>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
      <nav className="bg-[#1f2937]/60 border-b border-slate-800 px-6 py-3 flex gap-3 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('tsql')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'tsql'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          استعلامات T-SQL
        </button>
        <button
          onClick={() => setActiveTab('ifrs9')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'ifrs9'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          معيار IFRS 9 (الخسائر الائتمانية المتوقعة)
        </button>
        <button
          onClick={() => setActiveTab('erp')}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            activeTab === 'erp'
              ? 'bg-amber-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          الربط المباشر (ERP)
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 transition-all duration-300 p-6">
        {activeTab === 'tsql' && (
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl">
            <SqlViewer />
          </div>
        )}

        {activeTab === 'ifrs9' && (
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl">
            <Ifrs9EclViewer />
          </div>
        )}

        {activeTab === 'erp' && (
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-xl">
            <ErpConnector />
          </div>
        )}
      </main>
    </div>
  );
}