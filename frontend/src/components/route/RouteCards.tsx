import React from 'react';
import { Eye, Edit2, Trash2, MapPin, Clock, ArrowRight, Navigation } from 'lucide-react';
import type { Route } from '@/types/route';
import { RouteStatusBadge } from './RouteStatusBadge';
import { RouteTypeBadge } from './RouteTypeBadge';

interface RouteCardsProps {
  routes: Route[];
  onView: (route: Route) => void;
  onEdit: (route: Route) => void;
  onDelete: (id: string) => void;
}

export const RouteCards: React.FC<RouteCardsProps> = ({
  routes,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {routes.map((route) => (
        <div
          key={route.id}
          onClick={() => onView(route)}
          className="group rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors font-mono">
                  {route.routeCode}
                </h3>
                <RouteTypeBadge type={route.routeType} size="sm" />
              </div>
            </div>
            <RouteStatusBadge status={route.status} size="sm" />
          </div>

          {/* Corridor Waypoints */}
          <div className="rounded-xl bg-muted/20 border border-border/60 p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate max-w-[120px]">{route.originCity || route.originAddress}</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-destructive shrink-0" />
                <span className="truncate max-w-[120px]">{route.destinationCity || route.destinationAddress}</span>
              </div>
            </div>
          </div>

          {/* Metrics Footer */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/60">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="font-bold text-foreground">
                {route.plannedDistance ? `${route.plannedDistance} mi` : 'N/A'}
              </span>
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="h-3 w-3" />
                {route.estimatedDuration ? `${route.estimatedDuration} hrs` : 'N/A'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onView(route)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="View Route"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onEdit(route)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Edit Route"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(route.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete Route"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RouteCards;
