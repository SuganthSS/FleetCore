import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, MapPin, Navigation, Clock } from 'lucide-react';
import type { Route } from '@/types/route';
import { RouteStatusBadge } from './RouteStatusBadge';
import { RouteTypeBadge } from './RouteTypeBadge';

interface RouteTableProps {
  routes: Route[];
  onView: (route: Route) => void;
  onEdit: (route: Route) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const RouteTable: React.FC<RouteTableProps> = ({
  routes,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return (
      <ArrowUpDown className={`ml-1.5 h-3.5 w-3.5 text-primary ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
    );
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '—';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs === 0) return `${mins} mins`;
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th
                onClick={() => onSort('routeCode')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Route Code
                  {renderSortIndicator('routeCode')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Origin
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Destination
              </th>
              <th
                onClick={() => onSort('distance')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Distance
                  {renderSortIndicator('distance')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Estimated Duration
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Route Type
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Status
              </th>
              <th
                onClick={() => onSort('createdAt')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Created Date
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {routes.map((route) => {
              return (
                <tr
                  key={route.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Route Code */}
                  <td className="p-4 font-bold text-primary select-all">
                    {route.routeCode}
                  </td>

                  {/* Origin */}
                  <td className="p-4 text-xs font-semibold text-foreground max-w-[220px] truncate">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {route.originCity || route.originAddress}
                    </span>
                  </td>

                  {/* Destination */}
                  <td className="p-4 text-xs font-semibold text-foreground max-w-[220px] truncate">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      {route.destinationCity || route.destinationAddress}
                    </span>
                  </td>

                  {/* Distance */}
                  <td className="p-4 text-xs font-semibold text-foreground">
                    {route.plannedDistance ? (
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3 text-muted-foreground/60" />
                        {route.plannedDistance} km
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Estimated Duration */}
                  <td className="p-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground/50" />
                      {formatDuration(route.estimatedDuration)}
                    </span>
                  </td>

                  {/* Route Type */}
                  <td className="p-4">
                    <RouteTypeBadge type={route.routeType} />
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <RouteStatusBadge status={route.status} />
                  </td>

                  {/* Created Date */}
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(route.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(route)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(route)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Route"
                        aria-label="Edit Route"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(route.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Route"
                        aria-label="Delete Route"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default RouteTable;
