import React from 'react';
import { NavigationOff, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';

interface TripEmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  onCreateTrip?: () => void;
  hasFilters?: boolean;
}

export const TripEmptyState: React.FC<TripEmptyStateProps> = ({
  title = 'No trips found',
  description = 'No fleet trips match your search criteria or operational filters.',
  onClearFilters,
  onCreateTrip,
  hasFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-card/50 space-y-4">
      <div className="p-4 rounded-2xl bg-primary/10 text-primary">
        <NavigationOff className="h-8 w-8" />
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
        {onCreateTrip && (
          <Button size="sm" onClick={onCreateTrip}>
            + Create Trip
          </Button>
        )}
      </div>
    </div>
  );
};

interface TripErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const TripErrorState: React.FC<TripErrorStateProps> = ({
  message = 'An unexpected error occurred while fetching trip records.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-destructive/20 rounded-2xl bg-destructive/5 space-y-4">
      <div className="p-3 rounded-2xl bg-destructive/10 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-bold text-destructive">Failed to Load Trips</h3>
        <p className="text-xs text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-3.5 w-3.5" />
        Retry Request
      </Button>
    </div>
  );
};
