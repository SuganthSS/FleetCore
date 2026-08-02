import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, Calendar, Fuel, Truck, Navigation, CircleDollarSign } from 'lucide-react';
import type { FuelRecord } from '@/types/fuel';

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
    if (sortBy !== field) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 opacity-40" />;
    return (
      <ArrowUpDown className={`ml-1.5 h-3.5 w-3.5 text-primary ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th
                onClick={() => onSort('createdAt')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Record Number
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Vehicle
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Trip
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Fuel Station
              </th>
              <th
                onClick={() => onSort('fuelDate')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Fuel Date
                  {renderSortIndicator('fuelDate')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Quantity
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Price / Unit
              </th>
              <th
                onClick={() => onSort('totalCost')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center justify-end">
                  Total Cost
                  {renderSortIndicator('totalCost')}
                </div>
              </th>
              <th
                onClick={() => onSort('odometerReading')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center justify-end">
                  Odometer
                  {renderSortIndicator('odometerReading')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {records.map((record) => {
              return (
                <tr
                  key={record.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Record Number */}
                  <td className="p-4 font-bold text-primary select-all whitespace-nowrap">
                    {record.fuelRecordNumber}
                  </td>

                  {/* Vehicle */}
                  <td className="p-4 text-xs font-semibold text-foreground whitespace-nowrap">
                    {record.vehicle ? (
                      <span className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        {record.vehicle.registrationNumber}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Trip */}
                  <td className="p-4 text-xs font-semibold text-foreground whitespace-nowrap">
                    {record.trip && record.trip.tripNumber ? (
                      <span className="flex items-center gap-1.5">
                        <Navigation className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        {record.trip.tripNumber}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </td>

                  {/* Fuel Station */}
                  <td className="p-4 text-xs font-bold text-foreground max-w-[180px] truncate">
                    <span className="flex items-center gap-1.5" title={record.stationName}>
                      <Fuel className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {record.stationName}
                    </span>
                  </td>

                  {/* Fuel Date */}
                  <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/50" />
                      {formatDate(record.refueledAt)}
                    </span>
                  </td>

                  {/* Quantity */}
                  <td className="p-4 text-xs font-semibold text-foreground text-right whitespace-nowrap">
                    {record.quantity.toFixed(2)} L
                  </td>

                  {/* Price per unit */}
                  <td className="p-4 text-xs font-semibold text-foreground text-right whitespace-nowrap">
                    {formatCurrency(record.pricePerUnit)}
                  </td>

                  {/* Total Cost */}
                  <td className="p-4 text-xs font-bold text-foreground text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <CircleDollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      {formatCurrency(record.totalCost)}
                    </span>
                  </td>

                  {/* Odometer */}
                  <td className="p-4 text-xs font-semibold text-muted-foreground text-right whitespace-nowrap">
                    {record.odometerReading.toLocaleString()} mi
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(record)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(record)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Record"
                        aria-label="Edit Record"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Record"
                        aria-label="Delete Record"
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
export default FuelTable;
