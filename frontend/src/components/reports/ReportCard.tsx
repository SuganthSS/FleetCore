import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onExport: () => void;
  loading?: boolean;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  title,
  description,
  icon: Icon,
  onExport,
  loading = false,
}) => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-xs transition-all duration-300 hover:shadow-md hover:border-border-hover group">
      <div className="space-y-3 text-left">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Button */}
      <div className="mt-5">
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={loading}
          className="w-full flex items-center justify-center gap-1.5 font-bold"
        >
          <Download className="h-3.5 w-3.5" />
          Export Report
        </Button>
      </div>
    </div>
  );
};
export default ReportCard;
