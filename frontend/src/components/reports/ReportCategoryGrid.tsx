import React from 'react';
import {
  Truck,
  Users,
  Car,
  Compass,
  MapPin,
  Package,
  Fuel,
  Wrench,
  Building2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import type { ReportCategory } from './ReportsToolbar';

export interface CategoryItem {
  key: ReportCategory;
  title: string;
  count: number;
  description: string;
  icon: any;
  color: string;
}

interface ReportCategoryGridProps {
  onSelectCategory: (cat: ReportCategory) => void;
  selectedCategory: ReportCategory;
}

export const ReportCategoryGrid: React.FC<ReportCategoryGridProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const categories: CategoryItem[] = [
    {
      key: 'FLEET',
      title: 'Fleet Reports',
      count: 4,
      description: 'Fleet availability, utilization index, and asset valuation.',
      icon: Truck,
      color: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
    },
    {
      key: 'DRIVER',
      title: 'Driver Reports',
      count: 3,
      description: 'Operator safety scores, HOS compliance, and trip performance.',
      icon: Users,
      color: 'text-purple-600 bg-purple-500/10 border-purple-500/20',
    },
    {
      key: 'VEHICLE',
      title: 'Vehicle Reports',
      count: 3,
      description: 'Odometer logs, telematics metrics, and active vehicle list.',
      icon: Car,
      color: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20',
    },
    {
      key: 'TRIP',
      title: 'Trip Reports',
      count: 2,
      description: 'Completed dispatches, active trips, and route duration logs.',
      icon: Compass,
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      key: 'ROUTE',
      title: 'Route Reports',
      count: 2,
      description: 'Route optimization, waypoint stop delays, and traffic logs.',
      icon: MapPin,
      color: 'text-teal-600 bg-teal-500/10 border-teal-500/20',
    },
    {
      key: 'SHIPMENT',
      title: 'Shipment Reports',
      count: 2,
      description: 'Cargo SLA compliance, delivered orders, and pending dispatches.',
      icon: Package,
      color: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
    },
    {
      key: 'FUEL',
      title: 'Fuel Reports',
      count: 2,
      description: 'Consumption rate, refuel expenditure, and station cost breakdown.',
      icon: Fuel,
      color: 'text-cyan-600 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      key: 'MAINTENANCE',
      title: 'Maintenance Reports',
      count: 2,
      description: 'Repair bay work orders, parts replacement, and scheduled services.',
      icon: Wrench,
      color: 'text-rose-600 bg-rose-500/10 border-rose-500/20',
    },
    {
      key: 'CUSTOMER',
      title: 'Customer Reports',
      count: 2,
      description: 'Active client accounts, fulfillment history, and cargo billing.',
      icon: Building2,
      color: 'text-sky-600 bg-sky-500/10 border-sky-500/20',
    },
    {
      key: 'AUDIT',
      title: 'Audit Reports',
      count: 2,
      description: 'System security events, user activity logs, and compliance audits.',
      icon: ShieldCheck,
      color: 'text-slate-600 bg-slate-500/10 border-slate-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.key;

        return (
          <button
            key={cat.key}
            onClick={() => onSelectCategory(isSelected ? 'ALL' : cat.key)}
            className={`flex flex-col justify-between p-4 rounded-2xl border bg-card text-left transition-all duration-200 hover:shadow-xs group ${
              isSelected ? 'ring-2 ring-primary border-primary' : 'border-border'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl border ${cat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                  {cat.count} Templates
                </span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-border/40 text-[10px] font-bold text-primary">
              <span>View Templates</span>
              <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ReportCategoryGrid;
