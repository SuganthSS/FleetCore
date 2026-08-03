import React from 'react';
import { Sliders, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SettingsEmptyStateProps {
  onRetry?: () => void;
}

export const SettingsEmptyState: React.FC<SettingsEmptyStateProps> = ({ onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card">
      <div className="p-3 rounded-full bg-muted text-muted-foreground mb-3">
        <Sliders className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-foreground">No Settings Configured</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
        Default organization settings could not be retrieved. Click retry to reload.
      </p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="outline" className="mt-4 text-xs gap-1.5 font-semibold">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </Button>
      )}
    </div>
  );
};
export default SettingsEmptyState;
