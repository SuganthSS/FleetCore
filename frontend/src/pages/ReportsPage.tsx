import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { dashboardService } from '@/services/dashboard.service';
import {
  ReportsHeader,
  ReportsKPICards,
  ReportsToolbar,
  ReportCategoryGrid,
  ReportTemplateCard,
  ReportHistoryTable,
  ScheduledReportsCard,
  ReportBuilder,
  ReportPreview,
  ReportDrawer,
  ReportSkeleton,
  ReportEmptyState,
  ReportErrorState,
  ReportCategory,
  ReportTemplate,
  ReportHistoryRecord,
  ScheduledReport,
  ReportBuilderFormValues,
} from '@/components/reports';

export const ReportsPage: React.FC = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('ALL');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [activeKPICard, setActiveKPICard] = useState('');

  // Modals & Drawers state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ReportTemplate | null>(null);
  const [previewCustomConfig, setPreviewCustomConfig] = useState<ReportBuilderFormValues | null>(null);
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<ReportHistoryRecord | null>(null);

  // Success / Error alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TanStack Query Overview Data
  const { data: overview, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['reportsOverview', dateRange],
    queryFn: async () => {
      const response = await dashboardService.getOverview();
      return response.data;
    },
  });

  // Mock Report Templates Dataset (24 Templates across 10 categories)
  const reportTemplates: ReportTemplate[] = useMemo(
    () => [
      {
        id: 'tpl-1',
        category: 'FLEET',
        title: 'Fleet Operational Availability & Utilization',
        description: 'Detailed report of active, idle, and maintenance vehicles with efficiency metrics.',
        format: 'CSV',
        estimatedTime: '2s',
        popular: true,
      },
      {
        id: 'tpl-2',
        category: 'FLEET',
        title: 'Fleet Asset Valuation & Status Report',
        description: 'Comprehensive inventory valuation, acquisition dates, and depreciation breakdown.',
        format: 'EXCEL',
        estimatedTime: '3s',
      },
      {
        id: 'tpl-3',
        category: 'DRIVER',
        title: 'Driver Safety Scores & HOS Compliance',
        description: 'Safety rankings, speed violations, hard braking events, and hours of service logs.',
        format: 'PDF',
        estimatedTime: '4s',
        popular: true,
      },
      {
        id: 'tpl-4',
        category: 'DRIVER',
        title: 'Driver Duty Schedule & Trip Assignment Log',
        description: 'Work schedules, completed trip dispatches, and shift duration reports.',
        format: 'CSV',
        estimatedTime: '2s',
      },
      {
        id: 'tpl-5',
        category: 'VEHICLE',
        title: 'Vehicle Odometer & Telematics Summary',
        description: 'Mileage accumulation, engine runtime hours, and GPS odometer tracking.',
        format: 'EXCEL',
        estimatedTime: '3s',
      },
      {
        id: 'tpl-6',
        category: 'TRIP',
        title: 'Trip Dispatch Execution & Route Delays',
        description: 'Completed dispatches, delay root causes, and waypoint transit times.',
        format: 'CSV',
        estimatedTime: '2s',
        popular: true,
      },
      {
        id: 'tpl-7',
        category: 'ROUTE',
        title: 'Route Efficiency & Waypoint Audit Report',
        description: 'Actual vs estimated route completion times and toll expenditure.',
        format: 'PDF',
        estimatedTime: '5s',
      },
      {
        id: 'tpl-8',
        category: 'SHIPMENT',
        title: 'Shipment SLA Fulfillment & Cargo Delivery',
        description: 'On-time delivery percentages, customer sign-off timestamps, and SLA breaches.',
        format: 'EXCEL',
        estimatedTime: '3s',
      },
      {
        id: 'tpl-9',
        category: 'FUEL',
        title: 'Fuel Expenditure & Consumption Telemetry',
        description: 'Refuel transaction logs, fuel card expenses, and MPG efficiency per vehicle.',
        format: 'CSV',
        estimatedTime: '2s',
        popular: true,
      },
      {
        id: 'tpl-10',
        category: 'MAINTENANCE',
        title: 'Maintenance Work Orders & Repair Bay Spend',
        description: 'Preventive service logs, parts replacements, technician labor hours, and costs.',
        format: 'PDF',
        estimatedTime: '4s',
        popular: true,
      },
      {
        id: 'tpl-11',
        category: 'CUSTOMER',
        title: 'Customer Cargo Fulfillment & Account Billing',
        description: 'Monthly client billing statements, freight weights, and shipment totals.',
        format: 'EXCEL',
        estimatedTime: '3s',
      },
      {
        id: 'tpl-12',
        category: 'AUDIT',
        title: 'System Audit Logs & Security Access Record',
        description: 'Role-based access logs, user authentication events, and data export audits.',
        format: 'CSV',
        estimatedTime: '2s',
      },
    ],
    []
  );

  // Mock Report History State
  const [historyRecords, setHistoryRecords] = useState<ReportHistoryRecord[]>([
    {
      id: 'REP-8092',
      reportName: 'Monthly Fleet Maintenance & Downtime Audit',
      category: 'MAINTENANCE',
      format: 'PDF',
      generatedAt: '2026-08-03 14:22',
      generatedBy: 'Admin User',
      fileSize: '2.4 MB',
      status: 'COMPLETED',
    },
    {
      id: 'REP-8091',
      reportName: 'Q3 Driver HOS & Safety Compliance Report',
      category: 'DRIVER',
      format: 'CSV',
      generatedAt: '2026-08-02 09:15',
      generatedBy: 'Operations Lead',
      fileSize: '840 KB',
      status: 'COMPLETED',
    },
    {
      id: 'REP-8090',
      reportName: 'Fuel Expenditure & Refuel Station Analysis',
      category: 'FUEL',
      format: 'EXCEL',
      generatedAt: '2026-08-01 18:40',
      generatedBy: 'Fleet Controller',
      fileSize: '1.8 MB',
      status: 'COMPLETED',
    },
  ]);

  // Mock Scheduled Reports State
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: 'SCH-101',
      reportName: 'Weekly Executive Fleet Availability Summary',
      frequency: 'WEEKLY',
      recipients: ['executives@fleetcore.com', 'ops@fleetcore.com'],
      nextRun: '2026-08-10 08:00',
      status: 'ACTIVE',
      format: 'PDF',
    },
    {
      id: 'SCH-102',
      reportName: 'Daily Overdue Maintenance Alert Dispatch',
      frequency: 'DAILY',
      recipients: ['maintenance-bay@fleetcore.com'],
      nextRun: '2026-08-04 06:00',
      status: 'ACTIVE',
      format: 'CSV',
    },
  ]);

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return reportTemplates.filter((tpl) => {
      const matchesSearch =
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'ALL' || tpl.category === selectedCategory;
      const matchesFmt = selectedFormat === 'ALL' || tpl.format === selectedFormat;

      return matchesSearch && matchesCat && matchesFmt;
    });
  }, [reportTemplates, searchQuery, selectedCategory, selectedFormat]);

  const clearAlertLater = () => {
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 5000);
  };

  // Actions
  const handleRefresh = async () => {
    await refetch();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setDateRange('30d');
    setSelectedFormat('ALL');
    setActiveKPICard('');
  };

  const handleTemplatePreview = (template: ReportTemplate) => {
    setPreviewTemplate(template);
    setPreviewCustomConfig(null);
    setPreviewOpen(true);
  };

  const handleCustomBuilderPreview = (config: ReportBuilderFormValues) => {
    setPreviewCustomConfig(config);
    setPreviewTemplate(null);
    setPreviewOpen(true);
  };

  const downloadFileClientSide = (filename: string, content: string) => {
    const encodedUri = encodeURI(content);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateTemplate = (template: ReportTemplate) => {
    const content =
      `data:text/csv;charset=utf-8,ReportTitle,Category,Format,GeneratedAt\n` +
      `"${template.title}","${template.category}","${template.format}","${new Date().toISOString()}"\n`;

    downloadFileClientSide(`report_${template.id}_${Date.now()}.${template.format.toLowerCase()}`, content);

    const newRecord: ReportHistoryRecord = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      reportName: template.title,
      category: template.category,
      format: template.format,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      generatedBy: 'Current User',
      fileSize: '1.2 MB',
      status: 'COMPLETED',
    };

    setHistoryRecords((prev) => [newRecord, ...prev]);
    setSuccessMessage(`Report "${template.title}" generated and downloaded successfully!`);
    clearAlertLater();
  };

  const handleBuilderGenerate = (config: ReportBuilderFormValues) => {
    const content =
      `data:text/csv;charset=utf-8,ReportTitle,Category,DateRange,Format,GroupBy,SortBy\n` +
      `"${config.title}","${config.category}","${config.dateRange}","${config.format}","${config.groupBy}","${config.sortBy}"\n`;

    downloadFileClientSide(`custom_report_${Date.now()}.${config.format.toLowerCase()}`, content);

    const newRecord: ReportHistoryRecord = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      reportName: config.title,
      category: config.category,
      format: config.format,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      generatedBy: 'Current User',
      fileSize: '1.5 MB',
      status: 'COMPLETED',
    };

    setHistoryRecords((prev) => [newRecord, ...prev]);
    setSuccessMessage(`Custom Report "${config.title}" generated successfully!`);
    clearAlertLater();
  };

  const handleExportAll = () => {
    const content =
      `data:text/csv;charset=utf-8,ExportType,TotalTemplates,GeneratedAt\n` +
      `"All Enterprise Reports","${reportTemplates.length}","${new Date().toISOString()}"\n`;

    downloadFileClientSide(`fleetcore_all_reports_bundle_${Date.now()}.csv`, content);
    setSuccessMessage('Consolidated report bundle exported successfully.');
    clearAlertLater();
  };

  const handleToggleSchedule = (id: string) => {
    setScheduledReports((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' } : s
      )
    );
    setSuccessMessage('Scheduled report frequency status updated.');
    clearAlertLater();
  };

  const handleHistoryDownload = (rec: ReportHistoryRecord) => {
    const content =
      `data:text/csv;charset=utf-8,ReportID,ReportName,Category,Format,GeneratedAt\n` +
      `"${rec.id}","${rec.reportName}","${rec.category}","${rec.format}","${rec.generatedAt}"\n`;

    downloadFileClientSide(`${rec.id}_download.${rec.format.toLowerCase()}`, content);
    setSuccessMessage(`Downloaded report file: ${rec.reportName}`);
    clearAlertLater();
  };

  const handleHistoryPreview = (rec: ReportHistoryRecord) => {
    setSelectedHistoryRecord(rec);
    setDrawerOpen(true);
  };

  const handleHistoryDelete = (id: string) => {
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id));
    setSuccessMessage('Report entry deleted from history.');
    clearAlertLater();
  };

  if (isLoading && !overview) {
    return <ReportSkeleton />;
  }

  if (error) {
    return (
      <ReportErrorState
        title="Failed to Load Reports Center"
        description={error instanceof Error ? error.message : 'An error occurred while compiling reports.'}
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <ReportsHeader
        onBuildReport={() => {
          const el = document.getElementById('report-builder-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onRefresh={handleRefresh}
        isRefreshing={isFetching}
        onExportAll={handleExportAll}
        dateRangeLabel={dateRange === '30d' ? 'Last 30 Days' : dateRange.toUpperCase()}
      />

      {/* Notifications */}
      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400 animate-scale-up">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 animate-scale-up">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Stitch KPI Summary Cards */}
      <ReportsKPICards
        overview={overview || null}
        activeCard={activeKPICard}
        onSelectCard={setActiveKPICard}
      />

      {/* Filter Toolbar */}
      <ReportsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
        onReset={handleResetFilters}
      />

      {/* Report Categories Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-left">
          Report Category Explorer
        </h3>
        <ReportCategoryGrid
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Available Report Templates Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Available Report Templates ({filteredTemplates.length})
          </h3>
          {selectedCategory !== 'ALL' && (
            <span className="text-xs text-primary font-bold">
              Filter Active: {selectedCategory}
            </span>
          )}
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((tpl) => (
              <ReportTemplateCard
                key={tpl.id}
                template={tpl}
                onGenerate={handleGenerateTemplate}
                onPreview={handleTemplatePreview}
              />
            ))}
          </div>
        ) : (
          <ReportEmptyState
            title="No Report Templates Match Filter"
            description="Try resetting your category or search query parameters."
            action={
              <button
                onClick={handleResetFilters}
                className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
              >
                Reset Filters
              </button>
            }
          />
        )}
      </div>

      {/* Custom Report Builder Component */}
      <div id="report-builder-section">
        <ReportBuilder
          initialCategory={selectedCategory}
          onGenerateReport={handleBuilderGenerate}
          onPreviewReport={handleCustomBuilderPreview}
        />
      </div>

      {/* Scheduled Reports & Generated History Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScheduledReportsCard
            schedules={scheduledReports}
            onToggleStatus={handleToggleSchedule}
            onCreateSchedule={() => {
              setSuccessMessage('Schedule creation workflow initiated.');
              clearAlertLater();
            }}
          />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Recent Report Generation History
          </h3>
          <ReportHistoryTable
            history={historyRecords}
            onDownload={handleHistoryDownload}
            onViewPreview={handleHistoryPreview}
            onDelete={handleHistoryDelete}
          />
        </div>
      </div>

      {/* Live Preview Modal */}
      <ReportPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        template={previewTemplate}
        customConfig={previewCustomConfig}
        onDownload={() => {
          if (previewTemplate) handleGenerateTemplate(previewTemplate);
          if (previewCustomConfig) handleBuilderGenerate(previewCustomConfig);
          setPreviewOpen(false);
        }}
        onPrint={() => {
          window.print();
        }}
      />

      {/* Audit Drawer */}
      <ReportDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        record={selectedHistoryRecord}
        onDownload={handleHistoryDownload}
      />
    </div>
  );
};

export default ReportsPage;
