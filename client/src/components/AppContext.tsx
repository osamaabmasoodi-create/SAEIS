// @ts-nocheck
import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  fileName: string;
  totalAccounts: number;
  complianceRate: number;
  isBalanced: boolean;
  balanceDifference: number;
  eclSummary: {
    totalExposure: number;
    stage1Ecl: number;
    stage2Ecl: number;
    stage3Ecl: number;
  };
  updateAppData: (newData: Partial<AppContextType>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // البيانات المركزية الموحدة للملف المعتمد في العرض
  const [appState, setAppState] = useState({
    fileName: 'SAEIS_Master_Audit_Demo_3000.xlsx',
    totalAccounts: 3000,
    complianceRate: 97.8,
    isBalanced: false,
    balanceDifference: 8606704.47,
    eclSummary: {
      totalExposure: 428000,
      stage1Ecl: 12840,
      stage2Ecl: 17120,
      stage3Ecl: 8540,
    },
  });

  const updateAppData = (newData: Partial<AppContextType>) => {
    setAppState((prev) => ({ ...prev, ...newData }));
  };

  return (
    <AppContext.Provider value={{ ...appState, updateAppData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    // قيمة افتراضية لضمان عدم حدوث أي انهيار (Fallback)
    return {
      fileName: 'SAEIS_Master_Audit_Demo_3000.xlsx',
      totalAccounts: 3000,
      complianceRate: 97.8,
      isBalanced: false,
      balanceDifference: 8606704.47,
      eclSummary: { totalExposure: 428000, stage1Ecl: 12840, stage2Ecl: 17120, stage3Ecl: 8540 },
      updateAppData: () => {},
    };
  }
  return context;
};