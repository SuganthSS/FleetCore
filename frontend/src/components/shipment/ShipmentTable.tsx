import { Eye, Edit2, Trash2, ArrowUpRight, MapPin, Building2 } from 'lucide-react';
import type { Shipment } from '@/types/shipment';
import { ShipmentStatusBadge } from './ShipmentStatusBadge';
import { ShipmentPriorityBadge } from './ShipmentPriorityBadge';

interface ShipmentTableProps {
  shipments: Shipment[];
  onView: (shipment: Shipment) => void;
  onEdit: (shipment: Shipment) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({
  shipments,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const renderSortIndicator = (field: string) => {
    if (sortBy !== field) return null;
    return <span className="ml-1 text-[10px] font-mono">{sortOrder === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <th
              onClick={() => onSort('shipmentNumber')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Shipment # {renderSortIndicator('shipmentNumber')}
            </th>
            <th className="py-3.5 px-4">Title & Cargo</th>
            <th className="py-3.5 px-4">Customer</th>
            <th className="py-3.5 px-4">Origin → Destination</th>
            <th
              onClick={() => onSort('expectedDeliveryDate')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Est. Delivery {renderSortIndicator('expectedDeliveryDate')}
            </th>
            <th className="py-3.5 px-4">Priority</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs font-medium">
          {shipments.map((shipment) => (
            <tr
              key={shipment.id}
              className="hover:bg-muted/30 transition-colors group"
            >
              {/* Shipment Number */}
              <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                <button
                  onClick={() => onView(shipment)}
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  {shipment.shipmentNumber}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </button>
              </td>

              {/* Title & Cargo */}
              <td className="py-3.5 px-4">
                <div className="font-bold text-foreground max-w-[180px] truncate">
                  {shipment.title}
                </div>
                {shipment.cargoType && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {shipment.cargoType} • {shipment.weight ? `${shipment.weight} kg` : 'N/A'}
                  </span>
                )}
              </td>

              {/* Customer */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate max-w-[140px]">
                    {shipment.customer?.companyName || 'N/A'}
                  </span>
                </div>
              </td>

              {/* Origin -> Destination */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-bold text-foreground">{shipment.pickupCity}</span>
                  <span>→</span>
                  <span className="font-bold text-foreground">{shipment.deliveryCity}</span>
                </div>
              </td>

              {/* Est Delivery */}
              <td className="py-3.5 px-4 font-mono text-muted-foreground">
                {shipment.expectedDeliveryDate
                  ? new Date(shipment.expectedDeliveryDate).toLocaleDateString()
                  : 'Unscheduled'}
              </td>

              {/* Priority */}
              <td className="py-3.5 px-4">
                <ShipmentPriorityBadge priority={shipment.priority} size="sm" />
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <ShipmentStatusBadge status={shipment.status} size="sm" />
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(shipment)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Quick Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(shipment)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit Shipment"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(shipment.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Delete Record"
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
  );
};

export default ShipmentTable;
