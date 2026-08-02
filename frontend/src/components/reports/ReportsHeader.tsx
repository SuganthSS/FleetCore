import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportsHeaderProps {
  onGenerateReport: () => void;
  loading?: boolean;
}

export const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  onGenerateReport,
  loading = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reports
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Generate and export operational reports.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onGenerateReport}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Generate Report</span>
        </Button>
      </div>
    </div>
  );
};
export default ReportsHeader;
