import React from 'react';
import {
  FileText,
  Clock,
  Download,
  CheckCircle2,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react';
import type { DashboardOverviewResult } from '@/types/dashboard';

interface ReportsKPICardsProps {
  overview: DashboardOverviewResult | null;
  onSelectCard?: (key: string) => void;
  activeCard?: string;
}

export const ReportsKPICards: React.FC<ReportsKPICardsProps> = ({
  overview,
  onSelectCard,
  activeCard,
}) => {
  const cards = [
    {
      key: 'totalReports',
      label: 'Available Templates',
      value: '24 Reports',
      subtext: 'Across 10 Categories',
      icon: FileText,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
      activeBorder: 'ring-2 ring-blue-500',
    },
    {
      key: 'scheduled',
      label: 'Scheduled Audits',
      value: '6 Auto-Dispatches',
      subtext: 'Daily & Weekly Schedules',
      icon: Clock,
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      activeBorder: 'ring-2 ring-indigo-500',
    },
    {
      key: 'downloadsThisMonth',
      label: 'Exports This Month',
      value: '142 Downloads',
      subtext: 'CSV, Excel & PDF',
      icon: Download,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      activeBorder: 'ring-2 ring-emerald-500',
    },
    {
      key: 'fleetHealthScore',
      label: 'Compliance Index',
      value: '98.5 %',
      subtext: 'Zero Audit Faults',
      icon: CheckCircle2,
      color: 'text-teal-600 dark:text-teal-400 bg-teal-500/10 border-teal-500/20',
      activeBorder: 'ring-2 ring-teal-500',
    },
    {
      key: 'maintenanceCost',
      label: 'Maintenance Audit Spend',
      value: overview ? `$${((overview.maintenance.totalRecords || 10) * 420).toLocaleString()}` : '$42,500',
      subtext: 'Tracked Repair Costs',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      activeBorder: 'ring-2 ring-purple-500',
    },
    {
      key: 'customQueries',
      label: 'Custom Queries',
      value: '12 Filters Built',
      subtext: 'Saved Configurations',
      icon: SlidersHorizontal,
      color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      activeBorder: 'ring-2 ring-cyan-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeCard === card.key;

        return (
          <button
            key={card.key}
            onClick={() => onSelectCard && onSelectCard(isActive ? '' : card.key)}
            className={`flex flex-col justify-between p-3.5 rounded-2xl border bg-card text-left transition-all duration-200 hover:shadow-xs group ${
              card.color.split(' ')[2]
            } ${isActive ? card.activeBorder : ''}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-xl border ${card.color}`}>
                <Icon className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="text-base font-black text-foreground font-mono tracking-tight truncate">
                {card.value}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">
                {card.subtext}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ReportsKPICards;
