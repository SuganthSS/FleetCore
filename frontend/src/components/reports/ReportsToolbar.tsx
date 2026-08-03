import React from 'react';
import { Search, Calendar, RotateCcw } from 'lucide-react';

export type ReportCategory =
  | 'ALL'
  | 'FLEET'
  | 'DRIVER'
  | 'VEHICLE'
  | 'TRIP'
  | 'ROUTE'
  | 'SHIPMENT'
  | 'FUEL'
  | 'MAINTENANCE'
  | 'CUSTOMER'
  | 'AUDIT';

interface ReportsToolbarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: ReportCategory;
  onCategoryChange: (cat: ReportCategory) => void;
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  selectedFormat: string;
  onFormatChange: (val: string) => void;
  onReset: () => void;
}

export const ReportsToolbar: React.FC<ReportsToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  selectedFormat,
  onFormatChange,
  onReset,
}) => {
  const categories: { key: ReportCategory; label: string }[] = [
    { key: 'ALL', label: 'All Categories' },
    { key: 'FLEET', label: 'Fleet' },
    { key: 'DRIVER', label: 'Driver' },
    { key: 'VEHICLE', label: 'Vehicle' },
    { key: 'TRIP', label: 'Trip' },
    { key: 'ROUTE', label: 'Route' },
    { key: 'SHIPMENT', label: 'Shipment' },
    { key: 'FUEL', label: 'Fuel' },
    { key: 'MAINTENANCE', label: 'Maintenance' },
    { key: 'CUSTOMER', label: 'Customer' },
    { key: 'AUDIT', label: 'Audit' },
  ];

  const hasActiveFilters = Boolean(
    searchQuery || selectedCategory !== 'ALL' || dateRange !== '30d' || selectedFormat !== 'ALL'
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-2xl bg-card border border-border shadow-2xs">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search report templates, history, or scheduled audits..."
          className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as ReportCategory)}
          className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[150px] truncate"
        >
          {categories.map((cat) => (
            <option key={cat.key} value={cat.key}>
              {cat.label}
            </option>
          ))}
        </select>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 bg-background border border-input rounded-xl p-1 text-xs font-semibold">
          <Calendar className="h-3.5 w-3.5 text-primary ml-1.5 shrink-0" />
          <button
            onClick={() => onDateRangeChange('7d')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              dateRange === '7d' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            7D
          </button>
          <button
            onClick={() => onDateRangeChange('30d')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              dateRange === '30d' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            30D
          </button>
          <button
            onClick={() => onDateRangeChange('90d')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              dateRange === '90d' ? 'bg-primary text-white font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            90D
          </button>
        </div>

        {/* Format Selector */}
        <select
          value={selectedFormat}
          onChange={(e) => onFormatChange(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="ALL">All Formats</option>
          <option value="CSV">CSV Data</option>
          <option value="EXCEL">Excel Sheet</option>
          <option value="PDF">PDF Document</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onReset}
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

export default ReportsToolbar;
