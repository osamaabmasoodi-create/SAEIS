import React, { useState } from 'react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Calendar as CalendarIcon, Database, ShieldCheck, MessageSquare } from 'lucide-react';

import { SqlViewer } from '@/components/SqlViewer';
import { Ifrs9EclViewer } from '@/components/Ifrs9EclViewer';

// تعريف نوع البيانات Message محلياً لتجنب مشاكل التصدير من AIChatBox
export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState<'tsql' | 'ifrs9'>('tsql');
  const [datePickerDate, setDatePickerDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans dir-rtl" dir="rtl">
      {/* الهيدر الرئيسي للمنصة */}
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

        {/* منتقي التاريخ والوقت (Date Picker) */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-300">
            {datePickerDate
              ? format(datePickerDate, 'PPP HH:mm', { locale: arSA })
              : 'اختر التاريخ'}
          </span>
        </div>
      </header>

      {/* شريط التنقل بين الأقسام (Tabs Navigation) */}
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

      {/* عرض المكون النشط بناءً على التبويب المختار */}
      <main className="transition-all duration-300">
        {activeTab === 'tsql' && (
          <section className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <SqlViewer />
          </section>
        )}

        {activeTab === 'ifrs9' && (
          <section className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <Ifrs9EclViewer />
          </section>
        )}
      </main>
    </div>
  );
}