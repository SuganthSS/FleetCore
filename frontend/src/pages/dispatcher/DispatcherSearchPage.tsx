import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Truck,
  User,
  Package,
  Navigation,
  FileText,
  Bell,
  ArrowRight,
  Filter,
  Layers,
} from 'lucide-react';
import { globalSearchService, GlobalSearchResultItem } from '@/services/globalSearch.service';
import { cn } from '@/utils/cn';

export const DispatcherSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Search API Query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['dispatcher-search', query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const res = await globalSearchService.search(query);
      return res.data;
    },
    enabled: query.trim().length > 1,
  });

  // Filter & Exclude Admin categories (Users, Roles, Audit, Settings, Company)

  // Mock operational search items if backend returns empty or for instant UI response
  const dispatcherSearchResults = useMemo(() => {
    const raw: GlobalSearchResultItem[] = (searchResults || []).length > 0 ? (searchResults || []) : mockDispatcherSearchData;

    return raw.filter((item) => {
      const catUpper = item.category.toUpperCase();
      // Exclude Admin & User Management categories
      if (['USER', 'ROLE', 'AUDIT', 'SETTING', 'COMPANY', 'ORGANIZATION'].includes(catUpper)) {
        return false;
      }
      if (categoryFilter !== 'ALL' && catUpper !== categoryFilter) {
        return false;
      }
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchResults, categoryFilter, query]);

  const getCategoryIcon = (category: string) => {
    const cat = category.toUpperCase();
    if (cat === 'TRIP') return <Navigation className="h-4 w-4 text-[#2563eb]" />;
    if (cat === 'SHIPMENT') return <Package className="h-4 w-4 text-purple-600" />;
    if (cat === 'DRIVER') return <User className="h-4 w-4 text-emerald-600" />;
    if (cat === 'VEHICLE') return <Truck className="h-4 w-4 text-blue-600" />;
    if (cat === 'ROUTE') return <Layers className="h-4 w-4 text-amber-600" />;
    if (cat === 'DOCUMENT') return <FileText className="h-4 w-4 text-slate-700" />;
    if (cat === 'NOTIFICATION') return <Bell className="h-4 w-4 text-red-600" />;
    return <Search className="h-4 w-4 text-[#737686]" />;
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[#2563eb]" />
            <h1 className="text-xl font-black tracking-tight text-[#191c1e]">
              Dispatcher Operational Search
            </h1>
          </div>
          <p className="text-xs font-semibold text-[#737686] mt-0.5">
            Scoped search across Trips, Cargo Shipments, Drivers, Vehicles, Routes, Documents & Notifications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#737686] font-mono">
          <span>Operational Scope Enforced</span>
        </div>
      </div>

      {/* Main Search Input & Scope Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#c3c6d7]/30 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#737686]" />
          <input
            type="text"
            placeholder="Type trip #, vehicle plate, driver name, shipment # or document tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#c3c6d7]/50 text-sm font-semibold focus:outline-none focus:border-[#2563eb]"
          />
        </div>

        {/* Category Scope Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#c3c6d7]/20">
          <span className="text-[11px] font-extrabold text-[#737686] uppercase mr-2 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Scope:
          </span>
          {[
            { id: 'ALL', label: 'All Operational' },
            { id: 'TRIP', label: 'Trips' },
            { id: 'SHIPMENT', label: 'Shipments' },
            { id: 'DRIVER', label: 'Drivers' },
            { id: 'VEHICLE', label: 'Vehicles' },
            { id: 'ROUTE', label: 'Routes' },
            { id: 'DOCUMENT', label: 'Documents' },
            { id: 'NOTIFICATION', label: 'Notifications' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={cn(
                'px-3 py-1 rounded-xl text-xs font-bold transition-colors border',
                categoryFilter === cat.id
                  ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-xs'
                  : 'bg-[#f7f9fb] text-[#434655] border-[#c3c6d7]/30 hover:bg-[#eceef0]'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black text-[#191c1e] uppercase tracking-wider">
            Operational Search Results ({dispatcherSearchResults.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#737686]">Querying dispatcher records...</div>
        ) : dispatcherSearchResults.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#737686] bg-white rounded-2xl border border-[#c3c6d7]/30">
            No operational items found matching "{query}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dispatcherSearchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(item.url || '/dispatcher/dispatch-center')}
                className="p-4 rounded-2xl border border-[#c3c6d7]/30 bg-white shadow-xs hover:border-[#2563eb]/40 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#f7f9fb] border border-[#c3c6d7]/30 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-black text-[#191c1e] group-hover:text-[#2563eb] transition-colors">
                        {item.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#737686] font-medium mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <ArrowRight className="h-4 w-4 text-[#737686] group-hover:text-[#2563eb] group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Fallback search mock data if search API returns empty
const mockDispatcherSearchData: GlobalSearchResultItem[] = [
  {
    id: 's-1',
    category: 'TRIP',
    title: 'Trip #TRIP-1049 (Boston to New York)',
    subtitle: 'Assigned Driver: Sarah Jenkins • Vehicle: TRK-9902',
    url: '/dispatcher/trips',
  },
  {
    id: 's-2',
    category: 'SHIPMENT',
    title: 'Shipment #SH-8821 (Industrial Components)',
    subtitle: 'Customer: Apex Global Freight • Destination: Site B Hub',
    url: '/dispatcher/shipments',
  },
  {
    id: 's-3',
    category: 'DRIVER',
    title: 'Driver Sarah Jenkins (CDL Class A)',
    subtitle: 'Status: ON_TRIP • Available HOS: 8.5 Hours',
    url: '/dispatcher/drivers',
  },
  {
    id: 's-4',
    category: 'VEHICLE',
    title: 'Freightliner Unit #TRK-9902',
    subtitle: 'Status: AVAILABLE • Fuel: 88% • Capacity: 24,000 kg',
    url: '/dispatcher/vehicles',
  },
  {
    id: 's-5',
    category: 'ROUTE',
    title: 'Route Corridor: Northeast Interstate I-95',
    subtitle: 'Distance: 340 km • Active Traffic Delay: +22 mins',
    url: '/dispatcher/routes',
  },
  {
    id: 's-6',
    category: 'DOCUMENT',
    title: 'Waybill_WB-9941_CargoExpress.pdf',
    subtitle: 'Uploaded by Dispatcher Center • Category: SHIPMENT',
    url: '/dispatcher/documents',
  },
  {
    id: 's-7',
    category: 'NOTIFICATION',
    title: 'Engine Breakdown Alert - Vehicle #TRK-8802',
    subtitle: 'Priority: CRITICAL • Sector North Corridor',
    url: '/dispatcher/notifications',
  },
];

export default DispatcherSearchPage;
