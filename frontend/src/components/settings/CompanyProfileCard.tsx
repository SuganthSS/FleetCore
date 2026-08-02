import React from 'react';
import { AlertCircle, Building } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const CompanyProfileCard: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-4">
        <Building className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          Company Profile Configuration
        </h3>
      </div>

      <EmptyState
        title="Company Profile API Unavailable"
        description="The backend service endpoint for retrieving and configuring corporate company profiles is not mounted on this server node yet. Please contact the workspace system administrator."
        icon={<AlertCircle className="h-8 w-8 text-muted-foreground" />}
      />
    </div>
  );
};
export default CompanyProfileCard;
