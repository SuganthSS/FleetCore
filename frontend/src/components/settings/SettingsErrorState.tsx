import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const SettingsErrorState: React.FC<SettingsErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/30 rounded-xl bg-destructive/5 text-destructive">
      <div className="p-3 rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold">Failed to Load Organization Settings</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-md">
        {message || 'An error occurred while fetching settings from the server. Ensure you have Administrator privileges.'}
      </p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="outline" className="mt-4 text-xs gap-1.5 font-semibold text-foreground border-border">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};
export default SettingsErrorState;
