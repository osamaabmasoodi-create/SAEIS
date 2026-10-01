import React from 'react';

interface ExecutiveReportProps {
  recordNo: string;
  anomalyType: string;
  referenceFrame: string;
  rootCause: string;
  impactAndRisk: string;
  suggestedAction: string;
}

export const ExecutiveReportCard: React.FC<ExecutiveReportProps> = ({
  recordNo,
  anomalyType,
  referenceFrame,
  rootCause,
  impactAndRisk,
  suggestedAction
}) => {
  
  // دالة لتصدير أو طباعة تقرير السجل لمجلس الإدارة
  const handleExportBoardReport = () => {
    const reportContent = `
      === تقرير استشاري لمجلس الإدارة - منصة SAEIS ===
      رجل السجل: ${recordNo}
      نوع الاختلال: ${anomalyType}
      الإطار المرجعي: ${referenceFrame}
      -----------------------------------------
      السبب المباشر (Root Cause):
      ${rootCause}

      الأثر والمخاطر (Impact & Risk):
      ${impactAndRisk}

      العلاج المقترح والإجراء الرقابي:
      ${suggestedAction}
      -----------------------------------------
      تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}
    `;

    // طباعة أو فتح نافذة التصدير
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<html dir="rtl"><head><title>تقرير مجلس الإدارة - ${recordNo}</title></head><body style="font-family:Tahoma; padding:20px;"><pre style="white-space: pre-wrap; font-size:16px;">${reportContent}</pre></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm my-3">
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <span className="font-bold text-blue-900">بطاقة الشرح والاستشارة المرجعية ({recordNo})</span>
        <button 
          onClick={handleExportBoardReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
        >
          🖨️ تصدير تقرير مجلس الإدارة
        </button>
      </div>
      
      <div className="space-y-2 text-sm text-gray-700">
        <p><strong>السبب المباشر:</strong> {rootCause}</p>
        <p><strong>الأثر والمخاطر:</strong> {impactAndRisk}</p>
        <p><strong>العلاج المقترح:</strong> {suggestedAction}</p>
      </div>
    </div>
  );
};