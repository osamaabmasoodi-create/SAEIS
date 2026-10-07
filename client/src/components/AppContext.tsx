import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  activeFileName: string;
  totalRowsAnalyzed: string;
  rowCountNumber: number;
  complianceScore: string;
  violationsCount: string;
  ifrs16Impact: string;
  eclImpact: string;
  updateFileData: (fileName: string, rowCount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeFileName, setActiveFileName] = useState('SAEIS_GlobalCo_5000_Accounts_ForUpload.xlsx');
  const [rowCountNumber, setRowCountNumber] = useState(5000);
  const [totalRowsAnalyzed, setTotalRowsAnalyzed] = useState('5,000 حساب');
  const [complianceScore, setComplianceScore] = useState('97.8%');
  const [violationsCount, setViolationsCount] = useState('16 قيداً');
  const [ifrs16Impact, setIfs16Impact] = useState('$120,000');
  const [eclImpact, setEclImpact] = useState('$18,500');

  const updateFileData = (fileName: string, rowCount: number) => {
    setActiveFileName(fileName);
    setRowCountNumber(rowCount);
    setTotalRowsAnalyzed(`${rowCount.toLocaleString()} حساب`);

    // حساب النسب والأثر المالي ديناميكياً لتتأثر بها كل الشاشات
    const scaleFactor = rowCount / 5000;
    const calcViolations = Math.max(5, Math.floor(16 * Math.min(scaleFactor, 10)));
    const calc16 = Math.floor(120000 * scaleFactor);
    const calcEcl = Math.floor(18500 * scaleFactor);
    const calcScore = Math.max(82.0, (99.5 - (rowCount * 0.000015))).toFixed(1) + '%';

    setComplianceScore(calcScore);
    setViolationsCount(`${calcViolations.toLocaleString()} قيداً`);
    setIfs16Impact(`$${calc16.toLocaleString()}`);
    setEclImpact(`$${calcEcl.toLocaleString()}`);
  };

  return (
    <AppContext.Provider
      value={{
        activeFileName,
        totalRowsAnalyzed,
        rowCountNumber,
        complianceScore,
        violationsCount,
        ifrs16Impact,
        eclImpact,
        updateFileData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};