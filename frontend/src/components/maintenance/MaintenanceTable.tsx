import React from 'react';
import { Eye, Edit2, Trash2, ArrowUpRight, Truck, User, CheckCircle2 } from 'lucide-react';
import type { MaintenanceRecord } from '@/types/maintenance';
import { MaintenanceStatusBadge, MaintenancePriorityBadge } from './MaintenanceStatusBadge';
import { MaintenanceTypeBadge } from './MaintenanceTypeBadge';

interface MaintenanceTableProps {
  records: MaintenanceRecord[];
  onView: (record: MaintenanceRecord) => void;
  onEdit: (record: MaintenanceRecord) => void;
  onDelete: (id: string) => void;
  onCompleteWorkOrder?: (record: MaintenanceRecord) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
  records,
  onView,
  onEdit,
  onDelete,
  onCompleteWorkOrder,
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
              onClick={() => onSort('maintenanceRecordNumber')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Work Order Ref {renderSortIndicator('maintenanceRecordNumber')}
            </th>
            <th className="py-3.5 px-4">Vehicle Details</th>
            <th className="py-3.5 px-4">Service Category</th>
            <th className="py-3.5 px-4">Technician / Vendor</th>
            <th
              onClick={() => onSort('cost')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground font-mono"
            >
              Cost {renderSortIndicator('cost')}
            </th>
            <th
              onClick={() => onSort('scheduledDate')}
              className="py-3.5 px-4 cursor-pointer hover:text-foreground"
            >
              Target Date {renderSortIndicator('scheduledDate')}
            </th>
            <th className="py-3.5 px-4">Priority</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs font-medium">
          {records.map((record) => {
            const vehicleReg = record.vehicle?.registrationNumber || 'UNIT-UNASSIGNED';
            const vehicleMake = record.vehicle?.make || 'Fleet Vehicle';
            const technicianName = record.driver
              ? `${record.driver.firstName} ${record.driver.lastName}`
              : record.serviceProvider || 'Unassigned Tech';

            const isCompleted = record.status === 'COMPLETED';

            return (
              <tr key={record.id} className="hover:bg-muted/30 transition-colors group">
                {/* Work Order Code */}
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  <button
                    onClick={() => onView(record)}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span>{record.maintenanceRecordNumber}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                  </button>
                </td>

                {/* Vehicle */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Truck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>
                      {vehicleReg} <span className="font-normal text-muted-foreground">({vehicleMake})</span>
                    </span>
                  </div>
                </td>

                {/* Service Type */}
                <td className="py-3.5 px-4">
                  <MaintenanceTypeBadge type={record.maintenanceType} />
                </td>

                {/* Technician */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-1 text-foreground">
                    <User className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate max-w-[140px]">{technicianName}</span>
                  </div>
                </td>

                {/* Cost */}
                <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                  ${(record.cost || 0).toFixed(2)}
                </td>

                {/* Scheduled Date */}
                <td className="py-3.5 px-4 font-mono text-muted-foreground">
                  {new Date(record.scheduledDate).toLocaleDateString()}
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4">
                  <MaintenancePriorityBadge type={record.maintenanceType} />
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <MaintenanceStatusBadge status={record.status} />
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {!isCompleted && onCompleteWorkOrder && (
                      <button
                        onClick={() => onCompleteWorkOrder(record)}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                        title="Sign-Off & Complete Work Order"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onView(record)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="View Work Order"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(record)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit Work Order"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete Work Order"
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

export default MaintenanceTable;
