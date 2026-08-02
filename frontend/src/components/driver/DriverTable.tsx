import { Eye, Edit2, Trash2, ArrowUpDown, Phone } from 'lucide-react';

import type { Driver, DriverAvailability } from '@/types/driver';
import { DriverStatusBadge } from './DriverStatusBadge';

interface DriverTableProps {
  drivers: Driver[];
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: string) => void;
}

const getDriverAvatarBg = (level: string) => {
  switch (level) {
    case 'EXPERT':
      return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
    case 'SENIOR':
      return 'bg-orange-500/10 text-orange-500 border border-orange-500/20';
    case 'MID':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20';
  }
};

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
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

  const getStatusHelperText = (status: DriverAvailability) => {
    switch (status) {
      case 'AVAILABLE':
        return 'Active / Ready';
      case 'ON_TRIP':
        return 'Active / En Route';
      case 'OFF_DUTY':
        return 'Inactive / Rest';
      case 'ON_LEAVE':
        return 'Temporarily Away';
      case 'SUSPENDED':
        return 'Access Revoked';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] w-12">
                Driver
              </th>
              <th
                onClick={() => onSort('employeeId')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Emp ID
                  {renderSortIndicator('employeeId')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none">
                <div className="flex items-center">
                  Full Name
                </div>
              </th>
              <th
                onClick={() => onSort('licenseNumber')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  License Number
                  {renderSortIndicator('licenseNumber')}
                </div>
              </th>
              <th
                onClick={() => onSort('experienceLevel')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Experience
                  {renderSortIndicator('experienceLevel')}
                </div>
              </th>
              <th
                onClick={() => onSort('availability')}
                className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] cursor-pointer hover:text-foreground select-none"
              >
                <div className="flex items-center">
                  Availability
                  {renderSortIndicator('availability')}
                </div>
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Status Info
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                Phone
              </th>
              <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider text-[10px] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {drivers.map((driver) => {
              const fullName = driver.user
                ? `${driver.user.firstName} ${driver.user.lastName}`
                : 'Unknown Driver';
              const email = driver.user?.email || 'N/A';
              const phone = driver.user?.phone || 'N/A';
              const initials = driver.user
                ? `${driver.user.firstName.charAt(0)}${driver.user.lastName.charAt(0)}`
                : '??';

              return (
                <tr
                  key={driver.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Visual Avatar */}
                  <td className="p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-xs uppercase ${getDriverAvatarBg(driver.experienceLevel)}`}>
                      {initials}
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="p-4 font-semibold text-foreground">
                    {driver.employeeId}
                  </td>

                  {/* Full Name & Email */}
                  <td className="p-4">
                    <span className="block font-semibold text-foreground leading-none">
                      {fullName}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-1 select-all">
                      {email}
                    </span>
                  </td>

                  {/* License Number */}
                  <td className="p-4 text-xs font-semibold text-muted-foreground">
                    {driver.licenseNumber}
                  </td>

                  {/* Experience Level */}
                  <td className="p-4 text-xs font-medium text-foreground">
                    {driver.experienceLevel}
                  </td>

                  {/* Availability Badge */}
                  <td className="p-4">
                    <DriverStatusBadge status={driver.availability} />
                  </td>

                  {/* Status Helper Info */}
                  <td className="p-4 text-xs font-medium text-muted-foreground">
                    {getStatusHelperText(driver.availability)}
                  </td>

                  {/* Phone */}
                  <td className="p-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground/60" />
                      {phone}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(driver)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="View Details"
                        aria-label="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(driver)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        title="Edit Driver"
                        aria-label="Edit Driver"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(driver.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete Driver"
                        aria-label="Delete Driver"
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
export default DriverTable;
