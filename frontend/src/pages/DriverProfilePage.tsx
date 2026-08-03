import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  Mail,
  Phone,
  Award,
  Truck,
  FileText,
} from 'lucide-react';
import { driverService } from '@/services/driver.service';
import { DriverStatusBadge } from '@/components/driver/DriverStatusBadge';
import { LicenseStatusBadge } from '@/components/driver/LicenseStatusBadge';

export const DriverProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'license' | 'safety' | 'trips' | 'documents'>('overview');

  const { data: driverResponse, isLoading, error } = useQuery({
    queryKey: ['driver', id],
    queryFn: () => driverService.getDriver(id!),
    enabled: !!id,
  });

  const driver = driverResponse?.data;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Driver Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested driver profile does not exist or was deleted.</p>
        <button
          onClick={() => navigate('/drivers')}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold"
        >
          Return to Drivers
        </button>
      </div>
    );
  }

  const fullName = driver.user ? `${driver.user.firstName} ${driver.user.lastName}` : driver.employeeId;
  const initials = driver.user
    ? `${driver.user.firstName.charAt(0)}${driver.user.lastName.charAt(0)}`.toUpperCase()
    : driver.employeeId.slice(0, 2).toUpperCase();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/drivers')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Drivers Directory
      </button>

      {/* Driver Banner Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-extrabold text-2xl shadow-inner">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight font-display">{fullName}</h1>
              <DriverStatusBadge status={driver.availability} />
            </div>
            <p className="text-xs font-mono text-muted-foreground">Employee ID: {driver.employeeId}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {driver.user?.email || 'No email'}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-primary" />
                {driver.user?.phone || 'No phone'}
              </span>
              <span className="flex items-center gap-1 font-bold text-primary">
                <Award className="h-3.5 w-3.5" />
                {driver.experienceLevel} Level
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-center">
            <span className="block text-[10px] font-bold uppercase tracking-wider">Safety Score</span>
            <span className="text-xl font-black">98.4 / 100</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border gap-6">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'license', label: 'License & Certifications' },
          { id: 'safety', label: 'Safety & Performance' },
          { id: 'trips', label: 'Assigned Trips' },
          { id: 'documents', label: 'Documents' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Personal Details & Identification
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Full Name</span>
                    <span className="font-semibold text-foreground">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Employee ID</span>
                    <span className="font-mono font-bold text-foreground">{driver.employeeId}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">License Number</span>
                    <span className="font-mono text-foreground">{driver.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Joining Date</span>
                    <span className="font-medium text-foreground">
                      {driver.joiningDate ? new Date(driver.joiningDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Emergency Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Contact Name</span>
                    <span className="font-semibold text-foreground">
                      {driver.emergencyContactName || 'Not configured'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Contact Phone</span>
                    <span className="font-mono text-foreground">
                      {driver.emergencyContactPhone || 'Not configured'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'license' && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                License Details & Expiry
              </h3>
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border">
                <div>
                  <span className="text-xs font-mono font-bold text-foreground block">{driver.licenseNumber}</span>
                  <span className="text-[11px] text-muted-foreground">Commercial Driver License (Class A)</span>
                </div>
                <LicenseStatusBadge expiryDate={driver.licenseExpiry} />
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Telemetry & Incident Records
              </h3>
              <p className="text-xs text-muted-foreground">
                Driver safety analytics updated daily from telematics IoT stream.
              </p>
            </div>
          )}

          {activeTab === 'trips' && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Trip History
              </h3>
              <p className="text-xs text-muted-foreground">Showing recent completed and active freight routes.</p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Uploaded Driver Files
              </h3>
              <div className="space-y-2">
                {['CDL_License_Scan.pdf', 'Medical_Certificate_2026.pdf'].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-border text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">{doc}</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary hover:underline cursor-pointer">Download</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Assigned Vehicle
            </h3>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
              <Truck className="h-5 w-5 shrink-0" />
              <div>
                <span className="block text-xs font-bold">TRK-408 (Volvo FH16)</span>
                <span className="block text-[10px] text-muted-foreground">Status: Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverProfilePage;
