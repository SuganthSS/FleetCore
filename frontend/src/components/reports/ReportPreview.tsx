import React from 'react';
import { FileText, Download, Printer, X, Sparkles } from 'lucide-react';
import type { ReportTemplate } from './ReportTemplateCard';
import type { ReportBuilderFormValues } from './ReportBuilder';

interface ReportPreviewProps {
  open: boolean;
  onClose: () => void;
  template?: ReportTemplate | null;
  customConfig?: ReportBuilderFormValues | null;
  onDownload: () => void;
  onPrint: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  open,
  onClose,
  template,
  customConfig,
  onDownload,
  onPrint,
}) => {
  if (!open) return null;

  const title = customConfig?.title || template?.title || 'Fleet Operational Audit Report';
  const category = customConfig?.category || template?.category || 'FLEET';
  const format = customConfig?.format || template?.format || 'CSV';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-foreground">{title}</h3>
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold">
                  {category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                Live Data Preview • Format: {format}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs font-mono">
          {/* Executive Header Box */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5 font-sans">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Executive Summary Baseline
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                Status: Audit Ready
              </span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed font-sans">
              Compiled using real-time FleetCore database telemetry across vehicles, fuel records, maintenance logs, and active dispatch trips.
            </p>
          </div>

          {/* Table Preview Mock */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground font-sans uppercase tracking-wider">
              Data Sample (First 5 Rows)
            </h4>
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="p-2.5 font-bold">RECORD_ID</th>
                    <th className="p-2.5 font-bold">UNIT_NAME</th>
                    <th className="p-2.5 font-bold">CATEGORY</th>
                    <th className="p-2.5 font-bold">VALUE</th>
                    <th className="p-2.5 font-bold">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr>
                    <td className="p-2.5 text-primary">REC-2026-0801</td>
                    <td className="p-2.5">VOLVO-FH16 (TR-102)</td>
                    <td className="p-2.5">FLEET_TELEMETRY</td>
                    <td className="p-2.5 font-bold text-emerald-600">$4,250.00</td>
                    <td className="p-2.5 text-emerald-500 font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-primary">REC-2026-0802</td>
                    <td className="p-2.5">SCANIA-R500 (TR-105)</td>
                    <td className="p-2.5">FUEL_LOG</td>
                    <td className="p-2.5 font-bold text-emerald-600">$1,180.50</td>
                    <td className="p-2.5 text-emerald-500 font-bold">PASSED</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-primary">REC-2026-0803</td>
                    <td className="p-2.5">FREIGHTLINER (TR-109)</td>
                    <td className="p-2.5">MAINTENANCE_BAY</td>
                    <td className="p-2.5 font-bold text-amber-600">$650.00</td>
                    <td className="p-2.5 text-amber-500 font-bold">IN_PROGRESS</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-primary">REC-2026-0804</td>
                    <td className="p-2.5">KENWORTH-T680 (TR-112)</td>
                    <td className="p-2.5">TRIP_DISPATCH</td>
                    <td className="p-2.5 font-bold text-emerald-600">$8,400.00</td>
                    <td className="p-2.5 text-emerald-500 font-bold">DELIVERED</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-primary">REC-2026-0805</td>
                    <td className="p-2.5">PETERBILT-579 (TR-115)</td>
                    <td className="p-2.5">DRIVER_HOS</td>
                    <td className="p-2.5 font-bold text-indigo-600">48.5 hrs</td>
                    <td className="p-2.5 text-emerald-500 font-bold">COMPLIANT</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
          >
            <Printer className="h-4 w-4" />
            Print Report
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
            >
              Close
            </button>
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors shadow-md"
            >
              <Download className="h-4 w-4" />
              Download Complete File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
