import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpRight, MapPin, Clock } from 'lucide-react';
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
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return <ArrowUpRight className={`h-3 w-3 inline-block ml-1 transition-transform ${sortOrder === 'desc' ? 'rotate-90' : ''}`} />;
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider">
              <th
                onClick={() => onSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                Route Code {getSortIcon('name')}
              </th>
              <th className="py-3.5 px-4">Origin Corridor</th>
              <th className="py-3.5 px-4">Destination Corridor</th>
              <th
                onClick={() => onSort('distance')}
                className="py-3.5 px-4 cursor-pointer hover:text-foreground transition-colors"
              >
                Distance & ETA {getSortIcon('distance')}
              </th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {routes.map((route) => (
              <tr
                key={route.id}
                onClick={() => onView(route)}
                className="group hover:bg-muted/20 transition-colors cursor-pointer"
              >
                {/* Route Code */}
                <td className="py-3.5 px-4 font-mono font-bold text-primary group-hover:underline">
                  {route.routeCode}
                </td>

                {/* Origin */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{route.originCity || route.originAddress}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate max-w-[160px]">
                    {route.originAddress}
                  </span>
                </td>

                {/* Destination */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 text-foreground font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-destructive shrink-0" />
                    <span>{route.destinationCity || route.destinationAddress}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground block truncate max-w-[160px]">
                    {route.destinationAddress}
                  </span>
                </td>

                {/* Distance & Duration */}
                <td className="py-3.5 px-4">
                  <div className="font-bold text-foreground">
                    {route.plannedDistance ? `${route.plannedDistance} mi` : 'N/A'}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {route.estimatedDuration ? `${route.estimatedDuration} hrs` : 'N/A'}
                  </div>
                </td>

                {/* Type */}
                <td className="py-3.5 px-4">
                  <RouteTypeBadge type={route.routeType} size="sm" />
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <RouteStatusBadge status={route.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(route)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(route)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Route"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(route.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Route"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RouteTable;
