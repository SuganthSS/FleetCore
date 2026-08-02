import React, { useState } from 'react';
import {
  SettingsHeader,
  SettingsSidebar,
  CompanyProfileCard,
  AppearanceSettings,
  GeneralSettings,
  NotificationSettings,
  SecuritySettings,
  IntegrationSettings,
  AISettings,
  SettingsTab,
} from '@/components/settings';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <CompanyProfileCard />;
      case 'general':
        return <GeneralSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'ai':
        return <AISettings />;
      default:
        return <CompanyProfileCard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader />

      {/* Main Settings Container */}
      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
