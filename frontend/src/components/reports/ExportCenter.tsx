import React from 'react';
import { FileText, FileSpreadsheet, FileCode, CheckSquare, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';

interface ExportCenterProps {
  onExportFormat: (format: string) => void;
  loading?: boolean;
}

export const ExportCenter: React.FC<ExportCenterProps> = ({
  onExportFormat,
  loading = false,
}) => {
  const formats = [
    { name: 'PDF', icon: FileText, color: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/15' },
    { name: 'Excel', icon: FileSpreadsheet, color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15' },
    { name: 'CSV', icon: CheckSquare, color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/15' },
    { name: 'JSON', icon: FileCode, color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/15' },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-6 shadow-sm">
      <div>
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          Executive Export Center
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
          Download consolidated reports in premium layouts.
        </p>
      </div>

      {/* Format Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {formats.map((fmt, idx) => {
          const Icon = fmt.icon;
          return (
            <Button
              key={idx}
              variant="outline"
              onClick={() => onExportFormat(fmt.name)}
              disabled={loading}
              className={`h-12 flex items-center justify-center gap-2 font-bold transition-colors ${fmt.color}`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{fmt.name} format</span>
            </Button>
          );
        })}
      </div>

      {/* Coming Soon Alert via EmptyState */}
      <div className="pt-2">
        <EmptyState
          title="Direct Export APIs Coming Soon"
          description="Automated server-side report compilation pipelines are currently under development. Real-time exports will be enabled in a future release."
          icon={<Sparkles className="h-7 w-7 text-primary animate-pulse" />}
        />
      </div>
    </div>
  );
};
export default ExportCenter;
