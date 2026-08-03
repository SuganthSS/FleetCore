import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const VehicleErrorState: React.FC<VehicleErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-destructive/20 bg-destructive/5">
      <div className="p-4 rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-foreground">Failed to load fleet data</h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
        {message || 'Unable to retrieve vehicle information. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-6 gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default VehicleErrorState;
