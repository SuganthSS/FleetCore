import React from 'react';
import {
  Truck,
  Users,
  Package,
  Map,
  Fuel,
  Wrench,
  Navigation,
  Building,
} from 'lucide-react';
import { ReportCard } from './ReportCard';

interface ReportCategoryGridProps {
  onExportCategory: (categoryName: string) => void;
  loading?: boolean;
}

export const ReportCategoryGrid: React.FC<ReportCategoryGridProps> = ({
  onExportCategory,
  loading = false,
}) => {
  const categories = [
    {
      title: 'Fleet Report',
      description: 'Vehicle utilization, status distribution, and maintenance summary logs.',
      icon: Truck,
    },
    {
      title: 'Driver Report',
      description: 'Driver hours, assigned trips, safety behaviors, and availability indicators.',
      icon: Users,
    },
    {
      title: 'Shipment Report',
      description: 'Delivery fulfillment rates, pending orders, and transit logs.',
      icon: Package,
    },
    {
      title: 'Trip Report',
      description: 'Planned vs completed routes, active GPS logs, and travel duration trends.',
      icon: Map,
    },
    {
      title: 'Fuel Report',
      description: 'Fuel logs analysis, consumption trends, and cost efficiency evaluations.',
      icon: Fuel,
    },
    {
      title: 'Maintenance Report',
      description: 'Completed and pending work orders, costing metrics, and service downtime analysis.',
      icon: Wrench,
    },
    {
      title: 'Tracking Report',
      description: 'GPS route history, location pings audit, and telemetry data records.',
      icon: Navigation,
    },
    {
      title: 'Customer Report',
      description: 'Customer contracts, drop-off locations frequency, and delivery summaries.',
      icon: Building,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((cat, idx) => (
        <ReportCard
          key={idx}
          title={cat.title}
          description={cat.description}
          icon={cat.icon}
          onExport={() => onExportCategory(cat.title)}
          loading={loading}
        />
      ))}
    </div>
  );
};
export default ReportCategoryGrid;
