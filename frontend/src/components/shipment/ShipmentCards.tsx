import { MapPin, Building2, Calendar, Edit2, Trash2, ArrowUpRight } from 'lucide-react';
import type { Shipment } from '@/types/shipment';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';
import { ShipmentPriorityBadge } from './ShipmentPriorityBadge';

interface ShipmentCardsProps {
  shipments: Shipment[];
  onView: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
}

export const ShipmentCards: React.FC<ShipmentCardsProps> = ({
  shipments,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shipments.map((shipment) => (
        <div
          key={shipment.id}
          className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
        >
          {/* Card Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-muted-foreground uppercase tracking-wider">
                {shipment.shipmentNumber}
              </span>
              <ShipmentPriorityBadge priority={shipment.priority} size="sm" />
            </div>

            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                {shipment.title}
              </h3>
              <ShipmentStatusBadge status={shipment.status} size="sm" />
            </div>

            {shipment.customer && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate font-medium">{shipment.customer.companyName}</span>
              </div>
            )}
          </div>

          {/* Route & Cargo details */}
          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{shipment.pickupCity}</span>
              </div>
              <span className="text-muted-foreground text-[10px]">→</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-indigo-500" />
                <span>{shipment.deliveryCity}</span>
              </div>
            </div>

            {shipment.expectedDeliveryDate && (
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Est. Delivery:
                </span>
                <span className="font-mono font-semibold text-foreground">
                  {new Date(shipment.expectedDeliveryDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <button
              onClick={() => onView(shipment)}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              View Dispatch Details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(shipment)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Edit Shipment"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(shipment.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete Shipment"
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

export default ShipmentCards;
