import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  SettingsSkeleton,
  SettingsErrorState,
} from '@/components/settings';
import { settingsService } from '@/services/settings.service';
import type { SettingsTab } from '@/types/settings';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const {
    data: allSettings,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['organization-settings'],
    queryFn: () => settingsService.getAllSettings(),
    staleTime: 30000,
  });

  const renderContent = () => {
    if (isLoading) {
      return <SettingsSkeleton />;
    }

    if (isError) {
      return (
        <SettingsErrorState
          message={(error as Error)?.message}
          onRetry={() => refetch()}
        />
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <CompanyProfileCard
            initialData={allSettings?.company}
            onRefresh={() => refetch()}
          />
        );
      case 'general':
        return (
          <GeneralSettings
            initialData={allSettings?.general}
            onRefresh={() => refetch()}
          />
        );
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return (
          <NotificationSettings
            initialData={allSettings?.notifications}
            onRefresh={() => refetch()}
          />
        );
      case 'security':
        return (
          <SecuritySettings
            initialData={allSettings?.security}
            onRefresh={() => refetch()}
          />
        );
      case 'integrations':
        return (
          <IntegrationSettings
            initialData={allSettings?.integrations}
            onRefresh={() => refetch()}
          />
        );
      case 'ai':
        return (
          <AISettings
            initialData={allSettings?.ai}
            onRefresh={() => refetch()}
          />
        );
      default:
        return (
          <CompanyProfileCard
            initialData={allSettings?.company}
            onRefresh={() => refetch()}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SettingsHeader />

      {/* Main Settings Container */}
      <div className="flex flex-col lg:flex-row gap-6">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 min-w-0">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SettingsPage;
