import React from 'react';
import { Truck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleEmptyStateProps {
  hasFilters: boolean;
  onAddVehicle: () => void;
  onClearFilters: () => void;
}

export const VehicleEmptyState: React.FC<VehicleEmptyStateProps> = ({
  hasFilters,
  onAddVehicle,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-border bg-card">
      <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
        <Truck className="h-8 w-8" />
      </div>
      <h3 className="text-base font-bold text-foreground">
        {hasFilters ? 'No vehicles match your filters' : 'No vehicles in fleet'}
      </h3>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
        {hasFilters
          ? 'Try adjusting your search criteria or clearing the active filters.'
          : 'Add your first vehicle to start managing your FleetCore logistics fleet.'}
      </p>
      <div className="flex gap-3 mt-6">
        {hasFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        {!hasFilters && (
          <Button size="sm" onClick={onAddVehicle} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add First Vehicle
          </Button>
        )}
      </div>
    </div>
  );
};

export default VehicleEmptyState;
