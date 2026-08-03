import React from 'react';
import { Search, LayoutGrid, List } from 'lucide-react';

interface DocumentToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
}

export const DocumentToolbar: React.FC<DocumentToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
}) => {
  const categories = ['ALL', 'VEHICLE', 'DRIVER', 'TRIP', 'SHIPMENT', 'MAINTENANCE', 'COMPLIANCE'];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card border border-border rounded-2xl p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by file name or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Category Tabs & View Mode */}
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto justify-between md:justify-end">
        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-background p-1 rounded-xl border border-border shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('table')}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === 'table' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            }`}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
