import React from 'react';
import { PackageSearch, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface ShipmentEmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  onCreateShipment?: () => void;
  hasFilters?: boolean;
}

export const ShipmentEmptyState: React.FC<ShipmentEmptyStateProps> = ({
  title = 'No shipments found',
  description = 'No freight shipments match your search criteria.',
  onClearFilters,
  onCreateShipment,
  hasFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-card/50 space-y-4">
      <div className="p-4 rounded-2xl bg-primary/10 text-primary">
        <PackageSearch className="h-8 w-8" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        {hasFilters && onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Reset Filters
          </Button>
        )}
        {onCreateShipment && (
          <Button size="sm" onClick={onCreateShipment}>
            + Create Shipment
          </Button>
        )}
      </div>
    </div>
  );
};

interface ShipmentErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const ShipmentErrorState: React.FC<ShipmentErrorStateProps> = ({
  message = 'An unexpected error occurred while fetching shipments data.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-4">
      <div className="p-3 rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-bold text-destructive">Failed to Load Shipments</h3>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-3.5 w-3.5" />
        Retry Request
      </Button>
    </div>
  );
};
