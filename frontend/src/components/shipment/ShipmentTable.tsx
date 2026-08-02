import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, MapPin, Calendar, Weight } from 'lucide-react';
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
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return (
      <ArrowUpDown className={`ml-1.5 h-3.5 w-3.5 text-primary ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th
                onClick={() => onSort('shipmentNumber')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Shipment Number
                  {renderSortIndicator('shipmentNumber')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Customer
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Origin
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Destination
              </th>
              <th
                onClick={() => onSort('priority')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Priority
                  {renderSortIndicator('priority')}
                </div>
              </th>
              <th
                onClick={() => onSort('status')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Status
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Weight
              </th>
              <th
                onClick={() => onSort('expectedDeliveryDate')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Planned Delivery
                  {renderSortIndicator('expectedDeliveryDate')}
                </div>
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
            {shipments.map((shipment) => {
              return (
                <tr
                  key={shipment.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Shipment Number */}
                  <td className="p-4 font-bold text-primary select-all">
                    {shipment.shipmentNumber}
                  </td>

                  {/* Customer */}
                  <td className="p-4 font-semibold text-foreground">
                    {shipment.customer?.companyName || '—'}
                  </td>

                  {/* Origin */}
                  <td className="p-4 text-xs font-medium text-foreground max-w-[200px] truncate">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                      {shipment.pickupCity}, {shipment.pickupCountry}
                    </span>
                  </td>

                  {/* Destination */}
                  <td className="p-4 text-xs font-medium text-foreground max-w-[200px] truncate">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                      {shipment.deliveryCity}, {shipment.deliveryCountry}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="p-4">
                    <ShipmentPriorityBadge priority={shipment.priority} />
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <ShipmentStatusBadge status={shipment.status} />
                  </td>

                  {/* Weight */}
                  <td className="p-4 text-xs font-medium text-muted-foreground">
                    {shipment.weight ? (
                      <span className="flex items-center gap-1">
                        <Weight className="h-3 w-3 text-muted-foreground/50" />
                        {shipment.weight} kg
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Planned Delivery Date */}
                  <td className="p-4 text-xs font-semibold text-foreground">
                    {shipment.expectedDeliveryDate ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground/60" />
                        {new Date(shipment.expectedDeliveryDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Created Date */}
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(shipment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(shipment)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(shipment)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Shipment"
                        aria-label="Edit Shipment"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(shipment.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Shipment"
                        aria-label="Delete Shipment"
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
export default ShipmentTable;
