import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  Mail,
  Phone,
} from 'lucide-react';
import { customerService } from '@/services/customer.service';
import { CustomerStatusBadge } from '@/components/customer/CustomerStatusBadge';
import { CustomerTypeBadge } from '@/components/customer/CustomerTypeBadge';
import { getCustomerType } from '@/utils/customer';

export const CustomerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'info' | 'contacts' | 'billing' | 'shipments' | 'activity' | 'notes'
  >('overview');

  const { data: customerResponse, isLoading, error } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomer(id!),
    enabled: !!id,
  });

  const customer = customerResponse?.data;

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-lg font-bold text-foreground">Customer Profile Not Found</h2>
        <p className="text-xs text-muted-foreground">The requested customer account does not exist or was deleted.</p>
        <button
          onClick={() => navigate('/customers')}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
        >
          Return to Customer Directory
        </button>
      </div>
    );
  }

  const customerType = getCustomerType(customer.id);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('/customers')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Customer Directory
      </button>

      {/* Customer Header Banner */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-2xl shadow-inner">
            {customer.companyName.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{customer.companyName}</h1>
              <CustomerStatusBadge status={customer.status} />
              <CustomerTypeBadge type={customerType} />
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Account Code: <span className="font-bold text-foreground">{customer.customerCode}</span>
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1 font-medium">
                <Mail className="h-3.5 w-3.5 text-primary" />
                {customer.email}
              </span>
              {customer.phone && (
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {customer.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20 text-center min-w-[120px]">
            <span className="block text-[10px] font-bold uppercase tracking-wider">Total Shipments</span>
            <span className="text-xl font-black">{customer._count?.shipments ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-6 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'info', label: 'Company Information' },
          { id: 'contacts', label: 'Primary Contact' },
          { id: 'billing', label: 'Billing Information' },
          { id: 'shipments', label: 'Shipment History' },
          { id: 'activity', label: 'Recent Activity' },
          { id: 'notes', label: 'Notes & Timeline' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Organization Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Company Legal Name</span>
                    <span className="font-bold text-foreground">{customer.companyName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Customer Identifier</span>
                    <span className="font-mono font-bold text-foreground">{customer.customerCode}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Primary Contact</span>
                    <span className="font-semibold text-foreground">{customer.contactPerson || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Account Status</span>
                    <CustomerStatusBadge status={customer.status} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Corporate Address & Details
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Address:</span> {customer.address || 'N/A'}</p>
                <p><span className="text-muted-foreground">City:</span> {customer.city || 'N/A'}</p>
                <p><span className="text-muted-foreground">State/Province:</span> {customer.state || 'N/A'}</p>
                <p><span className="text-muted-foreground">Country:</span> {customer.country || 'N/A'}</p>
                <p><span className="text-muted-foreground">Postal Code:</span> {customer.postalCode || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Primary Contact Information
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Contact Person:</span> {customer.contactPerson || 'N/A'}</p>
                <p><span className="text-muted-foreground">Direct Email:</span> {customer.email}</p>
                <p><span className="text-muted-foreground">Phone Number:</span> {customer.phone || 'N/A'}</p>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Billing & Payment Specifications
              </h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground">Payment Terms:</span> Net 30 Days</p>
                <p><span className="text-muted-foreground">Billing Address:</span> Same as Corporate Address</p>
                <p><span className="text-muted-foreground">Currency:</span> USD ($)</p>
              </div>
            </div>
          )}

          {activeTab === 'shipments' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Assigned Freight Shipments
              </h3>
              <p className="text-xs text-muted-foreground">
                Total {customer._count?.shipments ?? 0} freight shipments linked to this account.
              </p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Audit Trail & Activity Log
              </h3>
              <p className="text-xs text-muted-foreground">Account profile initialized and verified.</p>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xs">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Account Notes & History
              </h3>
              <p className="text-xs text-muted-foreground">No custom internal notes recorded yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Account Metadata
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span className="font-mono text-foreground">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2">
                <span className="text-muted-foreground">Last Updated:</span>
                <span className="font-mono text-foreground">
                  {new Date(customer.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;
