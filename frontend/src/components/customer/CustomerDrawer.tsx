import React, { useState } from 'react';
import {
  X,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Customer } from '@/types/customer';
import { CustomerStatusBadge } from './CustomerStatusBadge';

interface CustomerDrawerProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export const CustomerDrawer: React.FC<CustomerDrawerProps> = ({
  open,
  customer,
  onClose,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'billing' | 'shipments'>('overview');

  if (!open || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-background/80 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md border-l border-border bg-card shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono">
                {customer.customerCode}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-xl">
                {customer.companyName.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-1 flex-1">
                <h2 className="text-lg font-bold text-foreground leading-snug">
                  {customer.companyName}
                </h2>
                <div className="flex items-center gap-2">
                  <CustomerStatusBadge status={customer.status} />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate(`/customers/${customer.id}`);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold text-xs transition-colors"
            >
              Open Full Customer Profile Page
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-border bg-muted/20 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'contacts', label: 'Contacts' },
              { id: 'billing', label: 'Billing' },
              { id: 'shipments', label: 'Shipments' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-border bg-muted/10 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Primary Contact</span>
                    <span className="font-bold text-foreground">{customer.contactPerson || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground font-medium">Email Address</span>
                    <span className="font-medium text-foreground">{customer.email}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground font-medium">Phone Number</span>
                    <span className="font-medium text-foreground">{customer.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground font-medium">Address</span>
                    <span className="font-medium text-foreground truncate max-w-[180px]">
                      {customer.address || customer.city || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Lifetime Total Shipments</span>
                  <div className="text-2xl font-black text-foreground font-mono">
                    {customer._count?.shipments ?? 0}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-3 text-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Key Organization Contacts
                </h3>
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-1">
                  <p className="font-bold text-foreground">{customer.contactPerson || 'Main Account Manager'}</p>
                  <p className="text-muted-foreground">{customer.email}</p>
                  <p className="text-muted-foreground">{customer.phone || 'No direct phone listed'}</p>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-3 text-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Billing & Credit Terms
                </h3>
                <div className="p-3.5 rounded-xl border border-border bg-muted/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Terms:</span>
                    <span className="font-bold text-foreground">Net 30 Days</span>
                  </div>
                  <div className="flex justify-between border-t border-border/60 pt-2">
                    <span className="text-muted-foreground">Credit Status:</span>
                    <span className="font-bold text-emerald-600">Approved ($50,000)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipments' && (
              <div className="space-y-3 text-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Recent Freight Assignments
                </h3>
                <p className="text-muted-foreground">
                  {customer._count?.shipments ?? 0} total shipments recorded for this enterprise account.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDrawer;
