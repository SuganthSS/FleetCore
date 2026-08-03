import React from 'react';
import { ArrowUpDown, Eye, Edit2, Trash2, ChevronUp, ChevronDown, Mail, Phone, Calendar, Award } from 'lucide-react';
import type { Driver } from '@/types/driver';
import { DriverStatusBadge } from './DriverStatusBadge';
import { LicenseStatusBadge } from './LicenseStatusBadge';

interface DriverTableProps {
  drivers: Driver[];
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const getDriverInitials = (driver: Driver) => {
  if (driver.user) {
    return `${driver.user.firstName.charAt(0)}${driver.user.lastName.charAt(0)}`.toUpperCase();
  }
  return driver.employeeId.slice(0, 2).toUpperCase();
};

const SortIcon: React.FC<{ field: string; sortBy: string; sortOrder: 'asc' | 'desc' }> = ({
  field,
  sortBy,
  sortOrder,
}) => {
  if (field !== sortBy) {
    return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30 group-hover:opacity-60 transition-opacity" />;
  }
  return sortOrder === 'asc' ? (
    <ChevronUp className="ml-1 h-3 w-3 text-primary" />
  ) : (
    <ChevronDown className="ml-1 h-3 w-3 text-primary" />
  );
};

const thClass =
  'px-4 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border select-none';
const sortThClass = `${thClass} cursor-pointer hover:text-foreground transition-colors group`;

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  onView,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-left text-sm">
          <thead className="bg-muted/30 backdrop-blur-sm sticky top-0 z-10">
            <tr>
              <th className={thClass}>Driver</th>
              <th className={sortThClass} onClick={() => onSort('employeeId')}>
                <div className="flex items-center">
                  Employee ID
                  <SortIcon field="employeeId" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={thClass}>Contact Info</th>
              <th className={sortThClass} onClick={() => onSort('licenseExpiry')}>
                <div className="flex items-center">
                  License Number / Expiry
                  <SortIcon field="licenseExpiry" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={sortThClass} onClick={() => onSort('experienceLevel')}>
                <div className="flex items-center">
                  Experience
                  <SortIcon field="experienceLevel" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={thClass}>Safety / Performance</th>
              <th className={sortThClass} onClick={() => onSort('availability')}>
                <div className="flex items-center">
                  Status
                  <SortIcon field="availability" sortBy={sortBy} sortOrder={sortOrder} />
                </div>
              </th>
              <th className={`${thClass} text-right`}>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/50">
            {drivers.map((driver) => {
              const fullName = driver.user
                ? `${driver.user.firstName} ${driver.user.lastName}`
                : driver.employeeId;

              return (
                <tr
                  key={driver.id}
                  className="group hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onView(driver)}
                >
                  {/* Driver Name + Avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                        {getDriverInitials(driver)}
                      </div>
                      <div>
                        <span className="block font-semibold text-sm text-foreground leading-none">
                          {fullName}
                        </span>
                        <span className="block text-[11px] text-muted-foreground mt-0.5 font-mono">
                          ID: {driver.employeeId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-xs text-foreground">
                      {driver.employeeId}
                    </span>
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {driver.user?.email && (
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="truncate max-w-[160px]">{driver.user.email}</span>
                        </div>
                      )}
                      {driver.user?.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span>{driver.user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* License Info */}
                  <td className="px-4 py-3">
                    <div>
                      <span className="block font-mono font-semibold text-xs text-foreground select-all">
                        {driver.licenseNumber}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1">
                        <LicenseStatusBadge expiryDate={driver.licenseExpiry} />
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(driver.licenseExpiry).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                      <Award className="h-3 w-3" />
                      {driver.experienceLevel}
                    </span>
                  </td>

                  {/* Safety score */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        98% Safety
                      </span>
                      <span className="text-[10px] text-muted-foreground">· 0 Incidents</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <DriverStatusBadge status={driver.availability} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(driver)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Profile"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(driver)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Driver"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(driver.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Driver"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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

export default DriverTable;
