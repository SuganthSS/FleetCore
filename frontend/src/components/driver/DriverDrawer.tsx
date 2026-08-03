import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  Award,
  Truck,
  MapPin,
  ExternalLink,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Driver } from '@/types/driver';
import { DriverStatusBadge } from './DriverStatusBadge';
import { LicenseStatusBadge } from './LicenseStatusBadge';

interface DriverDrawerProps {
  open: boolean;
  driver: Driver | null;
  onClose: () => void;
}

export const DriverDrawer: React.FC<DriverDrawerProps> = ({ open, driver, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'license' | 'safety' | 'trips'>('overview');

  if (!open || !driver) return null;

  const fullName = driver.user
    ? `${driver.user.firstName} ${driver.user.lastName}`
    : driver.employeeId;

  const initials = driver.user
    ? `${driver.user.firstName.charAt(0)}${driver.user.lastName.charAt(0)}`.toUpperCase()
    : driver.employeeId.slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-border bg-card shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  Employee ID: {driver.employeeId}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-lg">
                {initials}
              </div>
              <div className="space-y-1 flex-1">
                <h2 className="text-xl font-bold text-foreground leading-snug">{fullName}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <DriverStatusBadge status={driver.availability} />
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <Award className="h-3.5 w-3.5 text-primary" />
                    {driver.experienceLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick action button to full profile */}
            <button
              onClick={() => {
                onClose();
                navigate(`/drivers/${driver.id}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs transition-colors"
            >
              Open Full Profile Page
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-muted/20 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('license')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'license'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              License & Certs
            </button>
            <button
              onClick={() => setActiveTab('safety')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'safety'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Safety & Metrics
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'trips'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Recent Trips
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Personal & Contact Info
                  </h3>
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        Email Address
                      </span>
                      <span className="font-medium text-foreground">{driver.user?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        Phone Number
                      </span>
                      <span className="font-medium text-foreground">{driver.user?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        Joining Date
                      </span>
                      <span className="font-medium text-foreground">
                        {driver.joiningDate ? new Date(driver.joiningDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Emergency Contact
                  </h3>
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Contact Name</span>
                      <span className="font-semibold text-foreground">
                        {driver.emergencyContactName || 'Not configured'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Phone Number</span>
                      <span className="font-mono text-foreground">
                        {driver.emergencyContactPhone || 'Not configured'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned Vehicle Card */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Currently Assigned Vehicle
                  </h3>
                  <div className="rounded-xl border border-border bg-muted/10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Volvo FH16 (TRK-408)</h4>
                        <p className="text-[11px] text-muted-foreground">Heavy Cargo Semi-Trailer</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'license' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Commercial Driver License (CDL)
                  </h3>
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">License Number</span>
                      <span className="font-mono font-bold text-foreground select-all">
                        {driver.licenseNumber}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">License Status</span>
                      <LicenseStatusBadge expiryDate={driver.licenseExpiry} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Expiry Date</span>
                      <span className="font-medium text-foreground">
                        {new Date(driver.licenseExpiry).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Certifications & Permits
                  </h3>
                  <div className="space-y-2">
                    {[
                      { title: 'HAZMAT Materials Transport Permit', expiry: '2027-04-15' },
                      { title: 'Heavy Combination Vehicle Class (HC)', expiry: '2028-11-20' },
                      { title: 'First Aid & CPR Certification', expiry: '2026-09-30' },
                    ].map((cert, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs">
                        <div className="flex items-center gap-2">
                          <FileCheck className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium text-foreground">{cert.title}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Exp: {cert.expiry}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'safety' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl border border-border bg-muted/10 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Safety Score</span>
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">98.4 / 100</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-muted/10 text-center space-y-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Fuel Efficiency</span>
                    <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">8.9 L/100km</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Recent Safety Events
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="font-medium text-foreground">Zero Hard Braking Events</p>
                          <p className="text-[10px] text-muted-foreground">Past 30 Days</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">PASSED</span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="font-medium text-foreground">Speed Compliance (99.8%)</p>
                          <p className="text-[10px] text-muted-foreground">Interstate Highways</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600">EXCELLENT</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trips' && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Assigned Trip Logs
                </h3>
                <div className="space-y-3">
                  {[
                    { code: 'TRIP-8840', route: 'Chicago, IL → Dallas, TX', dist: '960 mi', status: 'COMPLETED', date: 'Yesterday' },
                    { code: 'TRIP-8912', route: 'Atlanta, GA → Miami, FL', dist: '660 mi', status: 'IN_PROGRESS', date: 'Today' },
                  ].map((trip, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-primary">{trip.code}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${trip.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'}`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {trip.route}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{trip.dist}</span>
                        <span>{trip.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDrawer;
