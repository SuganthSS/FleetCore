import React, { useState, useEffect } from 'react';
import { Search, X, Command, ArrowRight, CornerDownLeft, Sparkles, FileText, Truck, User, Wrench, Fuel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { globalSearchService, GlobalSearchResultItem } from '@/services/globalSearch.service';

interface GlobalSearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const GlobalSearchOverlay: React.FC<GlobalSearchOverlayProps> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigate = useNavigate();

  const recentSearches = ['Volvo FH16', 'John Doe', 'Trip TR-894', 'Radiator Service', 'Sector 4'];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await globalSearchService.search(query);
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  const handleSelectResult = (url: string) => {
    onClose();
    navigate(url);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Vehicles':
        return <Truck className="h-4 w-4 text-emerald-500" />;
      case 'Drivers':
      case 'Users':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'Maintenance':
        return <Wrench className="h-4 w-4 text-amber-500" />;
      case 'Fuel Logs':
        return <Fuel className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-purple-500" />;
    }
  };

  const categories = ['ALL', 'Vehicles', 'Drivers', 'Trips', 'Shipments', 'Maintenance', 'Fuel Logs'];

  const filteredResults = results.filter(
    (r) => selectedCategory === 'ALL' || r.category === selectedCategory
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md flex items-start justify-center pt-16 md:pt-24 p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-background">
          <Search className="h-5 w-5 text-primary shrink-0" />
          <input
            type="text"
            placeholder="Search vehicles, drivers, trips, maintenance, documents, or AI Copilot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-muted">
            <kbd className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
              ESC
            </kbd>
          </button>
        </div>

        {/* Category Filters */}
        {results.length > 0 && (
          <div className="flex items-center gap-1 px-5 py-2.5 border-b border-border bg-card overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results / Recent Searches Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-muted-foreground font-semibold flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Searching FleetCore telemetry & records...
            </div>
          ) : query.trim() ? (
            filteredResults.length > 0 ? (
              <div className="space-y-2">
                {filteredResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectResult(res.url)}
                    className="group flex items-center justify-between rounded-xl border border-border bg-background p-3.5 hover:border-primary/40 hover:bg-muted/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-card border border-border">
                        {getCategoryIcon(res.category)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                            {res.title}
                          </span>
                          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground uppercase border border-border">
                            {res.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{res.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground space-y-1">
                <p className="font-bold text-foreground">No matching results found for "{query}"</p>
                <p>Try searching by registration number, driver name, shipment waybill, or maintenance WO.</p>
              </div>
            )
          ) : (
            /* Recent Searches & Quick Suggestions */
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Recent Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
                    >
                      <Search className="h-3 w-3 text-muted-foreground" /> {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                  Quick Navigation
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => handleSelectResult('/ai-insights')}
                    className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Sparkles className="h-4 w-4" /> AI Fleet Copilot
                  </button>
                  <button
                    onClick={() => handleSelectResult('/documents')}
                    className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 text-foreground hover:bg-muted transition-colors"
                  >
                    <FileText className="h-4 w-4 text-purple-500" /> Document Repository
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="h-3.5 w-3.5 text-primary" /> Press Enter to select
          </span>
          <span className="flex items-center gap-1 font-semibold text-foreground">
            <Command className="h-3.5 w-3.5 text-primary" /> Global Enterprise Search
          </span>
        </div>
      </div>
    </div>
  );
};
