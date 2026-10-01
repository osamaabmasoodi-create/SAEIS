import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import AuditAnalytics from '../components/AuditAnalytics';
import AuditRulesIFRS from '../components/AuditRulesIFRS';
import ErpConnector from '../components/ErpConnector';
import CorrectionEngine from '../components/CorrectionEngine';
import AIChatBox from '../components/AIChatBox';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cfo');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="transition-all duration-300">
        {activeTab === 'cfo' && <AuditAnalytics />}
        {activeTab === 'ifrs' && <AuditRulesIFRS />}
        {activeTab === 'erp' && <ErpConnector />}
        {activeTab === 'engine' && <CorrectionEngine />}
        {activeTab === 'chat' && <AIChatBox />}
      </div>
    </DashboardLayout>
  );
};

export default Home;