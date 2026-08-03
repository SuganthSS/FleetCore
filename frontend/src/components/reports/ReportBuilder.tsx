import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SlidersHorizontal, Sparkles, Filter, Download } from 'lucide-react';
import type { ReportCategory } from './ReportsToolbar';

const reportBuilderSchema = z.object({
  title: z.string().min(3, 'Report title must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  dateRange: z.string(),
  format: z.enum(['CSV', 'EXCEL', 'PDF']),
  groupBy: z.string(),
  sortBy: z.string(),
  includeMetrics: z.boolean(),
});

export type ReportBuilderFormValues = z.infer<typeof reportBuilderSchema>;

interface ReportBuilderProps {
  onGenerateReport: (data: ReportBuilderFormValues) => void;
  onPreviewReport: (data: ReportBuilderFormValues) => void;
  initialCategory?: ReportCategory;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({
  onGenerateReport,
  onPreviewReport,
  initialCategory = 'FLEET',
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportBuilderFormValues>({
    resolver: zodResolver(reportBuilderSchema),
    defaultValues: {
      title: 'Custom Operational Report Audit',
      category: initialCategory === 'ALL' ? 'FLEET' : initialCategory,
      dateRange: '30d',
      format: 'CSV',
      groupBy: 'VEHICLE',
      sortBy: 'DATE_DESC',
      includeMetrics: true,
    },
  });

  const formValues = watch();

  return (
    <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary text-white shadow-xs">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-foreground">Interactive Report Builder</h3>
            <p className="text-xs text-muted-foreground">
              Configure parameters, metrics, grouping, and filters to generate structured telemetry reports.
            </p>
          </div>
        </div>
        <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          FleetCore AI Builder
        </span>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onGenerateReport)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Report Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Report Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="e.g. Q4 Fuel & Fleet Efficiency Audit"
            />
            {errors.title && (
              <p className="text-[10px] text-rose-500 font-semibold">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Target Category
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="FLEET">Fleet Operations</option>
              <option value="DRIVER">Driver Safety & HOS</option>
              <option value="VEHICLE">Vehicle Telematics</option>
              <option value="TRIP">Trip Dispatches</option>
              <option value="ROUTE">Route Performance</option>
              <option value="SHIPMENT">Shipment Cargo SLA</option>
              <option value="FUEL">Fuel Expenditure</option>
              <option value="MAINTENANCE">Maintenance Work Orders</option>
              <option value="CUSTOMER">Customer Fulfillment</option>
              <option value="AUDIT">System Audit Logs</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Time Horizon / Date Range
            </label>
            <select
              {...register('dateRange')}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="ytd">Year To Date (YTD)</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {/* Export Format */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Export Output Format
            </label>
            <select
              {...register('format')}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="CSV">CSV Data File (.csv)</option>
              <option value="EXCEL">Microsoft Excel (.xlsx)</option>
              <option value="PDF">PDF Executive Document (.pdf)</option>
            </select>
          </div>

          {/* Grouping */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Group Records By
            </label>
            <select
              {...register('groupBy')}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="VEHICLE">Vehicle Unit ID</option>
              <option value="DRIVER">Driver Personnel</option>
              <option value="DATE">Daily Summary</option>
              <option value="STATUS">Operational Status</option>
              <option value="COMPANY">Company Tenant</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Sort Order
            </label>
            <select
              {...register('sortBy')}
              className="w-full px-3 py-2 bg-background border border-input rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="DATE_DESC">Date (Newest First)</option>
              <option value="DATE_ASC">Date (Oldest First)</option>
              <option value="COST_DESC">Cost / Amount (Highest First)</option>
              <option value="STATUS_ASC">Status Alphabetical</option>
            </select>
          </div>
        </div>

        {/* Toggle options */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="includeMetrics"
            {...register('includeMetrics')}
            className="rounded border-input text-primary focus:ring-primary"
          />
          <label htmlFor="includeMetrics" className="text-xs font-medium text-foreground">
            Include aggregated AI executive metrics & KPI summaries in header section
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60">
          <button
            type="button"
            onClick={() => onPreviewReport(formValues)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            Live Preview
          </button>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors shadow-md"
          >
            <Download className="h-4 w-4" />
            Generate & Download Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportBuilder;
