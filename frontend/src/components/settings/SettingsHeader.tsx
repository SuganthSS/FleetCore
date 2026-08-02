import React from 'react';

export const SettingsHeader: React.FC = () => {
  return (
    <div className="border-b border-border pb-5 text-left">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Manage your company and application preferences.
      </p>
    </div>
  );
};
export default SettingsHeader;
