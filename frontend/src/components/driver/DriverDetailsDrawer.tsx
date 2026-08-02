import React from 'react';
import { X, User, ShieldAlert, Phone, Mail, Award, Calendar } from 'lucide-react';

import type { Driver } from '@/types/driver';
import { DriverStatusBadge } from './DriverStatusBadge';

interface DriverDetailsDrawerProps {
  driver: Driver | null;
  open: boolean;
  onClose: () => void;
}

export const DriverDetailsDrawer: React.FC<DriverDetailsDrawerProps> = ({
  driver,
  open,
  onClose,
}) => {
  if (!open || !driver) return null;

  const fullName = driver.user
    ? `${driver.user.firstName} ${driver.user.lastName}`
    : 'Unknown Driver';
  const email = driver.user?.email || 'N/A';
  const phone = driver.user?.phone || 'N/A';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer Panel */}
        <div className="pointer-events-auto w-screen max-w-md transform bg-card shadow-2xl transition-all duration-300 border-l border-border flex flex-col h-full animate-slide-in">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Driver Profile
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Employee ID: {driver.employeeId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close details panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Visual Hero Panel */}
            <div className="rounded-xl border border-border bg-muted/20 p-5 flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <User className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                {fullName}
              </h3>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                {driver.experienceLevel} DRIVER
              </p>
              <div className="mt-4">
                <DriverStatusBadge status={driver.availability} />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Contact Information
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <Mail className="h-4 w-4 text-muted-foreground/75 mt-0.5" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Email Address</span>
                    <span className="block text-foreground font-bold select-all mt-0.5">{email}</span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs border-t border-border/50 pt-3">
                  <Phone className="h-4 w-4 text-muted-foreground/75 mt-0.5" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Phone Number</span>
                    <span className="block text-foreground font-bold select-all mt-0.5">{phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* License Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                License Details
              </h4>

              <div className="grid grid-cols-2 gap-4">
                {/* License Number */}
                <div className="rounded-lg border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Award className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">License Number</span>
                  </div>
                  <span className="block text-sm font-semibold text-foreground select-all">
                    {driver.licenseNumber}
                  </span>
                </div>

                {/* Expiry Date */}
                <div className="rounded-lg border border-border/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Expiry Date</span>
                  </div>
                  <span className="block text-sm font-semibold text-foreground">
                    {new Date(driver.licenseExpiry).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Emergency Contact
              </h4>
              <div className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <ShieldAlert className="h-4 w-4 text-rose-500 mt-0.5" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Contact Name</span>
                    <span className="block text-foreground font-bold mt-0.5">
                      {driver.emergencyContactName || 'Not Provided'}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs border-t border-border/50 pt-3">
                  <Phone className="h-4 w-4 text-rose-500 mt-0.5" />
                  <div>
                    <span className="block text-muted-foreground font-semibold">Contact Phone</span>
                    <span className="block text-foreground font-bold mt-0.5">
                      {driver.emergencyContactPhone || 'Not Provided'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="space-y-3 border-t border-border pt-5">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                System Info
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Tenant Company</span>
                  <span className="font-semibold text-foreground">{driver.company?.name || 'FleetCore Account'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Joining Date</span>
                  <span className="font-semibold text-foreground">
                    {driver.joiningDate ? new Date(driver.joiningDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Not Set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Profile Created</span>
                  <span className="font-semibold text-foreground">
                    {new Date(driver.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Last Updated</span>
                  <span className="font-semibold text-foreground">
                    {new Date(driver.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DriverDetailsDrawer;
