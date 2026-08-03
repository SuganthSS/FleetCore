import React from 'react';
import { Calendar, RotateCcw, ArrowUpDown } from 'lucide-react';

export type DateRangePreset = '7d' | '30d' | '90d' | 'ytd' | 'custom';
export type ComparisonPeriod = 'previous_period' | 'previous_year' | 'none';

interface AnalyticsToolbarProps {
  dateRange: DateRangePreset;
  onDateRangeChange: (val: DateRangePreset) => void;
  comparisonPeriod: ComparisonPeriod;
  onComparisonChange: (val: ComparisonPeriod) => void;
  selectedVehicleId: string;
  onVehicleIdChange: (val: string) => void;
  selectedDriverId: string;
  onDriverIdChange: (val: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (val: string) => void;
  vehicles?: { id: string; name: string }[];
  drivers?: { id: string; name: string }[];
  onClearFilters: () => void;
}

export const AnalyticsToolbar: React.FC<AnalyticsToolbarProps> = ({
  dateRange,
  onDateRangeChange,
  comparisonPeriod,
  onComparisonChange,
  selectedVehicleId,
  onVehicleIdChange,
  selectedDriverId,
  onDriverIdChange,
  selectedDepartment,
  onDepartmentChange,
  vehicles = [],
  drivers = [],
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(
    selectedVehicleId || selectedDriverId || selectedDepartment || comparisonPeriod !== 'previous_period' || dateRange !== '30d'
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-2xs">
      {/* Filters group */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {/* Date Range Selector */}
        <div className="flex items-center gap-1 bg-background border border-input rounded-xl p-1 text-xs font-semibold">
          <Calendar className="h-3.5 w-3.5 text-primary ml-1.5 shrink-0" />
          <button
            onClick={() => onDateRangeChange('7d')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              dateRange === '7d' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => onDateRangeChange('30d')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              dateRange === '30d' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => onDateRangeChange('90d')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              dateRange === '90d' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            90D
          </button>
          <button
            onClick={() => onDateRangeChange('ytd')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              dateRange === 'ytd' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            YTD
          </button>
        </div>

        {/* Comparison selector */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <select
            value={comparisonPeriod}
            onChange={(e) => onComparisonChange(e.target.value as ComparisonPeriod)}
            className="pl-8 pr-6 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="previous_period">vs Prev Period</option>
            <option value="previous_year">vs Prev Year</option>
            <option value="none">No Comparison</option>
          </select>
        </div>

        {/* Department Filter */}
        <select
          value={selectedDepartment}
          onChange={(e) => onDepartmentChange(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Departments</option>
          <option value="LOGISTICS">Logistics & Freight</option>
          <option value="COLD_CHAIN">Cold Chain Division</option>
          <option value="HAZMAT">Hazmat Operations</option>
          <option value="LAST_MILE">Last Mile Delivery</option>
        </select>

        {/* Vehicle Filter */}
        {vehicles.length > 0 && (
          <select
            value={selectedVehicleId}
            onChange={(e) => onVehicleIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[150px] truncate"
          >
            <option value="">All Vehicles</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        )}

        {/* Driver Filter */}
        {drivers.length > 0 && (
          <select
            value={selectedDriverId}
            onChange={(e) => onDriverIdChange(e.target.value)}
            className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[150px] truncate"
          >
            <option value="">All Drivers</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default AnalyticsToolbar;
