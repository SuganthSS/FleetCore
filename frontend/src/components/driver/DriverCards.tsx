import React from 'react';
import { Eye, Edit2, Trash2, Mail, Phone, Calendar, Award, ShieldCheck } from 'lucide-react';
import type { Driver } from '@/types/driver';
import { DriverStatusBadge } from './DriverStatusBadge';
import { LicenseStatusBadge } from './LicenseStatusBadge';

interface DriverCardsProps {
  drivers: Driver[];
  onView: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}

export const DriverCards: React.FC<DriverCardsProps> = ({
  drivers,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {drivers.map((driver) => {
        const fullName = driver.user
          ? `${driver.user.firstName} ${driver.user.lastName}`
          : driver.employeeId;

        const initials = driver.user
          ? `${driver.user.firstName.charAt(0)}${driver.user.lastName.charAt(0)}`.toUpperCase()
          : driver.employeeId.slice(0, 2).toUpperCase();

        return (
          <div
            key={driver.id}
            onClick={() => onView(driver)}
            className="group rounded-xl border border-border bg-card p-5 space-y-4 hover:border-primary/40 hover:shadow-md transition-all cursor-pointer relative flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-sm">
                  {initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {fullName}
                  </h3>
                  <p className="text-xs font-mono text-muted-foreground mt-0.5">
                    {driver.employeeId}
                  </p>
                </div>
              </div>
              <DriverStatusBadge status={driver.availability} size="sm" />
            </div>

            {/* Middle Info Grid */}
            <div className="space-y-2 text-xs border-y border-border/60 py-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
                <span className="font-medium text-foreground truncate max-w-[170px]">
                  {driver.user?.email || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  Phone
                </span>
                <span className="font-medium text-foreground">
                  {driver.user?.phone || 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  Experience
                </span>
                <span className="font-bold text-primary">
                  {driver.experienceLevel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  License Expiry
                </span>
                <div className="flex items-center gap-1.5">
                  <LicenseStatusBadge expiryDate={driver.licenseExpiry} />
                  <span className="font-mono text-foreground text-[11px]">
                    {new Date(driver.licenseExpiry).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                98% Safety Score
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onView(driver)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="View Profile"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onEdit(driver)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit Driver"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDelete(driver.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete Driver"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DriverCards;
