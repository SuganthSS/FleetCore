import React from 'react';
import { Users, Plus, RefreshCw, Download } from 'lucide-react';

interface CustomerHeaderProps {
  totalCustomers: number;
  onAddCustomer: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  totalCustomers,
  onAddCustomer,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight font-display">
            Customer Management
          </h1>
          <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-extrabold text-primary border border-primary/20">
            {totalCustomers} {totalCustomers === 1 ? 'Customer' : 'Customers'}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Manage corporate enterprise accounts, client shipping relationships, contacts, and account billing.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-xs font-bold text-foreground shadow-xs hover:bg-muted disabled:opacity-50 transition-all"
          title="Refresh Directory"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        <button
          onClick={() => {
            const csvData = "CustomerCode,CompanyName,ContactPerson,Email,Phone,City,Country,Status\n";
            const blob = new Blob([csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
          }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-xs font-bold text-foreground shadow-xs hover:bg-muted transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </button>

        <button
          onClick={onAddCustomer}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerHeader;
