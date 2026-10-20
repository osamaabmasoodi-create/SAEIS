import React, { useState } from 'react';

interface BackupItem {
  id: string;
  backupName: string;
  backupType: 'كامل (Full Backup)' | 'تفاضلي (Differential)' | 'قيود التسوية فقط';
  fileSize: string;
  createdAt: string;
  status: 'جاهز للتحميل' | 'مؤرشف';
}

export default function AutomatedBackupHub() {
  const [scheduleFrequency, setScheduleFrequency] = useState<string>('يومياً (Daily at 02:00 AM)');
  const [retentionDays, setRetentionDays] = useState<number>(30);
  const [backupsList, setBackupsList] = useState<BackupItem[]>([
    {
      id: 'bk-101',
      backupName: 'SAEIS_Master_Full_Backup_2026_10_19.bak',
      backupType: 'كامل (Full Backup)',
      fileSize: '45.2 MB',
      createdAt: '2026-10-19 02:00 AM',
      status: 'جاهز للتحميل'
    },
    {
      id: 'bk-102',
      backupName: 'SAEIS_Adjustment_Entries_2026_10_18.json',
      backupType: 'قيود التسوية فقط',
      fileSize: '1.2 MB',
      createdAt: '2026-10-18 11:30 PM',
      status: 'جاهز للتحميل'
    }
  ]);

  const handleCreateManualBackup = () => {
    const newBackup: BackupItem = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      backupName: `SAEIS_Manual_Backup_${new Date().toISOString().slice(0, 10)}.bak`,
      backupType: 'كامل (Full Backup)',
      fileSize: '46.0 MB',
      createdAt: new Date().toLocaleString('ar-SA'),
      status: 'جاهز للتحميل'
    };
    setBackupsList([newBackup, ...backupsList]);
    alert('تم بنجاح إنشاء وتوليد نسخة احتياطية جديدة وحفظها في المسار المحلي المخصص.');
  };

  const handleDownloadBackup = (backupName: string) => {
    alert(`جاري تحميل النسخة الاحتياطية (${backupName}) إلى جهازك المحلي...`);
  };

  return (
    <div className="flex flex-col gap-5 text-right font-sans h-full" dir="rtl">
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h2 className="text-sm font-bold text-amber-400 mb-1">
            محرك النسخ الاحتياطي التلقائي وجدولة الحفظ المحلي (Automated Backup & Disaster Recovery Hub)
          </h2>
          <p className="text-xs text-slate-400">
            جدولة الحفظ التلقائي لقواعد البيانات، قيود التسوية، وإدارة النسخ الاحتياطية محلياً.
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          جدولة النسخ نشطة
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            إعدادات الجدول الزمني والاحتفاظ
          </h3>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-bold">تكرار النسخ الاحتياطي:</label>
            <select
              value={scheduleFrequency}
              onChange={(e) => setScheduleFrequency(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="يومياً (Daily at 02:00 AM)">يومياً (Daily at 02:00 AM)</option>
              <option value="أسبوعياً (Weekly on Friday)">أسبوعياً (Weekly on Friday)</option>
              <option value="شهرياً (Monthly End)">شهرياً (Monthly End)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-slate-400 font-bold">مدة الاحتفاظ بالنسخ (بالأيام):</label>
            <input
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
          <button
            onClick={handleCreateManualBackup}
            className="mt-2 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow"
          >
            إنشاء نسخة احتياطية فورية الآن (Backup Now)
          </button>
        </div>

        <div className="lg:col-span-2 bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
            سجل النسخ الاحتياطية المتاحة محلياً
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-slate-300">
                  <th className="p-2.5 border border-slate-800 text-right">اسم الملف</th>
                  <th className="p-2.5 border border-slate-800 text-right">نوع النسخة</th>
                  <th className="p-2.5 border border-slate-800 text-right">الحجم</th>
                  <th className="p-2.5 border border-slate-800 text-right">وقت الإنشاء</th>
                  <th className="p-2.5 border border-slate-800 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="text-slate-200 font-mono">
                {backupsList.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-2.5 border border-slate-800 text-amber-400 font-bold">{bk.backupName}</td>
                    <td className="p-2.5 border border-slate-800 font-sans">{bk.backupType}</td>
                    <td className="p-2.5 border border-slate-800 text-emerald-400">{bk.fileSize}</td>
                    <td className="p-2.5 border border-slate-800 text-slate-400">{bk.createdAt}</td>
                    <td className="p-2.5 border border-slate-800 text-center">
                      <button
                        onClick={() => handleDownloadBackup(bk.backupName)}
                        className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1 rounded-lg text-[10px] font-bold transition border border-slate-700"
                      >
                        تحميل النسخة
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}