import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpDown, Calendar, Wrench, Truck } from 'lucide-react';

import type { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceStatusBadge } from './MaintenanceStatusBadge';
import { MaintenanceTypeBadge } from './MaintenanceTypeBadge';

interface MaintenanceTableProps {
  records: MaintenanceRecord[];
  onView: (record: MaintenanceRecord) => void;
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
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

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '—';
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
                  Order Number
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Vehicle
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Type
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Status
              </th>
              <th
                onClick={() => onSort('scheduledDate')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Scheduled
                  {renderSortIndicator('scheduledDate')}
                </div>
              </th>
              <th
                onClick={() => onSort('completedDate')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Completed
                  {renderSortIndicator('completedDate')}
                </div>
              </th>
              <th
                onClick={() => onSort('estimatedCost')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center justify-end">
                  Est. Cost
                  {renderSortIndicator('estimatedCost')}
                </div>
              </th>
              <th
                onClick={() => onSort('actualCost')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center justify-end">
                  Act. Cost
                  {renderSortIndicator('actualCost')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Service Provider
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {records.map((record) => {
              const isCompleted = record.status === 'COMPLETED';

              return (
                <tr
                  key={record.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Order Number */}
                  <td className="p-4 font-bold text-primary select-all whitespace-nowrap">
                    {record.maintenanceRecordNumber}
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

                  {/* Type Badge */}
                  <td className="p-4 text-xs whitespace-nowrap">
                    <MaintenanceTypeBadge type={record.maintenanceType} />
                  </td>

                  {/* Status Badge */}
                  <td className="p-4 text-xs whitespace-nowrap">
                    <MaintenanceStatusBadge status={record.status} />
                  </td>

                  {/* Scheduled Date */}
                  <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/50" />
                      {formatDate(record.scheduledDate)}
                    </span>
                  </td>

                  {/* Completed Date */}
                  <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground/50" />
                      {formatDate(record.completedDate)}
                    </span>
                  </td>

                  {/* Estimated Cost */}
                  <td className="p-4 text-xs font-semibold text-foreground text-right whitespace-nowrap">
                    {isCompleted ? '—' : formatCurrency(record.cost)}
                  </td>

                  {/* Actual Cost */}
                  <td className="p-4 text-xs font-bold text-foreground text-right whitespace-nowrap">
                    {isCompleted ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(record.cost)}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Service Provider */}
                  <td className="p-4 text-xs font-bold text-foreground max-w-[150px] truncate">
                    <span className="flex items-center gap-1.5" title={record.serviceProvider || ''}>
                      <Wrench className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {record.serviceProvider || 'Unassigned'}
                    </span>
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
export default MaintenanceTable;
