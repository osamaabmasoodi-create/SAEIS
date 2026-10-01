import React, { useState } from 'react';
import { Calendar as CalendarIcon, Database, ShieldCheck } from 'lucide-react';

import { SqlViewer } from '../components/SqlViewer';
import { Ifrs9EclViewer } from '../components/Ifrs9EclViewer';

export default function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState<'tsql' | 'ifrs9'>('tsql');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans" dir="rtl">
      {/* رأس الصفحة الرئيسي */}
      <header className="mb-6 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-amber-500" />
            نظام SAEIS - منصة التدقيق والربط الذكي
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            لوحة التحكم المركزية وفحص المعايير المحاسبية الدولية (IFRS/IAS)
          </p>
        </div>

        {/* عرض التاريخ والوقت المباشر */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-300">
            {new Date().toLocaleDateString('ar-SA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </header>

      {/* شريط التنقل بين الاستعلامات ومحرك IFRS 9 */}
      <div className="flex items-center space-x-2 space-x-reverse mb-6 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('tsql')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'tsql'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          قواعد البيانات واستعلامات T-SQL
        </button>

        <button
          onClick={() => setActiveTab('ifrs9')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'ifrs9'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          محرك IFRS 9 (الخسائر الائتمانية المتوقعة)
        </button>
      </div>

      {/* عرض الشاشة المحددة */}
      <main className="transition-all duration-300">
        {activeTab === 'tsql' && (
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <SqlViewer />
          </div>
        )}

        {activeTab === 'ifrs9' && (
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <Ifrs9EclViewer />
          </div>
        )}
      </main>
    </div>
  );
}