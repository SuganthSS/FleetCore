import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpRight, Truck, MapPin } from 'lucide-react';
import type { FuelRecord } from '@/types/fuel';
import { FuelStatusBadge } from './FuelStatusBadge';

interface FuelTableProps {
  records: FuelRecord[];
  onView: (record: FuelRecord) => void;
  onEdit: (record: FuelRecord) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const FuelTable: React.FC<FuelTableProps> = ({
  records,
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
              onClick={() => onSort('fuelRecordNumber')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Record Ref {renderSortIndicator('fuelRecordNumber')}
            </th>
            <th className="py-3.5 px-4">Vehicle Details</th>
            <th className="py-3.5 px-4">Fuel Station</th>
            <th
              onClick={() => onSort('quantity')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground font-mono"
            >
              Quantity (Gal) {renderSortIndicator('quantity')}
            </th>
            <th className="py-3.5 px-4 font-mono">Price/Gal</th>
            <th
              onClick={() => onSort('totalCost')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground font-mono"
            >
              Total Expenditure {renderSortIndicator('totalCost')}
            </th>
            <th className="py-3.5 px-4 font-mono">Odometer</th>
            <th
              onClick={() => onSort('fuelDate')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Refuel Date {renderSortIndicator('fuelDate')}
            </th>
            <th className="py-3.5 px-4">Rate Tier</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs font-medium">
          {records.map((record) => {
            const vehicleReg = record.vehicle?.registrationNumber || 'UNIT-REFUEL';
            const vehicleMake = record.vehicle?.make || 'Fleet Vehicle';

            return (
              <tr key={record.id} className="hover:bg-muted/30 transition-colors group">
                {/* Record Code */}
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  <button
                    onClick={() => onView(record)}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span>{record.fuelRecordNumber}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </button>
                </td>

                {/* Vehicle */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{vehicleReg} <span className="font-normal text-muted-foreground">({vehicleMake})</span></span>
                  </div>
                </td>

                {/* Station */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-foreground">
                    <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="truncate max-w-[160px]">{record.stationName}</span>
                  </div>
                </td>

                {/* Quantity */}
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  {record.quantity} Gal
                </td>

                {/* Price/Unit */}
                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                  ${record.pricePerUnit.toFixed(2)}
                </td>

                {/* Total Cost */}
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  ${record.totalCost.toFixed(2)}
                </td>

                {/* Odometer */}
                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                  {record.odometerReading.toLocaleString()} mi
                </td>

                {/* Refuel Date */}
                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                  {new Date(record.refueledAt).toLocaleDateString()}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <FuelStatusBadge cost={record.totalCost} quantity={record.quantity} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(record)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(record)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Record"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Record"
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
  );
};

export default FuelTable;
