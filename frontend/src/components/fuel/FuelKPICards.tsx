import React from 'react';
import { Fuel, Gauge, DollarSign, Activity, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';

export interface FuelKPIData {
  totalConsumedGal: number;
  averageMPG: number;
  monthlyCost: number;
  avgPricePerGal: number;
  highestConsumpGal: number;
  lowestConsumpGal: number;
}

interface FuelKPICardsProps {
  data: FuelKPIData;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FuelKPICards: React.FC<FuelKPICardsProps> = ({
  data,
  activeFilter,
  onFilterChange,
}) => {
  const cards = [
    {
      id: 'total',
      filterKey: '',
      label: 'Total Fuel Consumed',
      value: `${data.totalConsumedGal.toLocaleString()} Gal`,
      icon: Fuel,
      accentColor: 'text-amber-600 dark:text-amber-400 border-amber-500/20',
      bgHover: 'hover:border-amber-500/40',
      sub: 'Across fleet active trips',
    },
    {
      id: 'avgMileage',
      filterKey: 'highEfficiency',
      label: 'Average Fleet Mileage',
      value: `${data.averageMPG.toFixed(1)} MPG`,
      icon: Gauge,
      accentColor: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      bgHover: 'hover:border-emerald-500/40',
      sub: '+0.4 MPG vs last month',
    },
    {
      id: 'monthlyCost',
      filterKey: 'highCost',
      label: 'Monthly Fuel Expenditure',
      value: `$${data.monthlyCost.toLocaleString()}`,
      icon: DollarSign,
      accentColor: 'text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      bgHover: 'hover:border-indigo-500/40',
      sub: 'Avg $3.85 / gallon',
    },
    {
      id: 'highest',
      filterKey: 'highestConsump',
      label: 'Highest Single Refuel',
      value: `${data.highestConsumpGal} Gal`,
      icon: TrendingUp,
      accentColor: 'text-rose-600 dark:text-rose-400 border-rose-500/20',
      bgHover: 'hover:border-rose-500/40',
      sub: 'Heavy Haul Transports',
    },
    {
      id: 'lowest',
      filterKey: 'lowestConsump',
      label: 'Lowest Single Refuel',
      value: `${data.lowestConsumpGal} Gal`,
      icon: TrendingDown,
      accentColor: 'text-blue-600 dark:text-blue-400 border-blue-500/20',
      bgHover: 'hover:border-blue-500/40',
      sub: 'Last Mile Delivery Vans',
    },
    {
      id: 'anomalies',
      filterKey: 'anomalies',
      label: 'Consumption Efficiency',
      value: '94.2%',
      icon: Activity,
      accentColor: 'text-purple-600 dark:text-purple-400 border-purple-500/20',
      bgHover: 'hover:border-purple-500/40',
      sub: 'Optimal burn range',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.filterKey;

        return (
          <button
            key={card.id}
            onClick={() => onFilterChange(isActive ? '' : card.filterKey)}
            className={`flex flex-col justify-between p-4 rounded-2xl border bg-card text-left transition-all duration-200 shadow-2xs ${
              card.bgHover
            } ${
              isActive
                ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-md'
                : 'border-border'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-xl bg-muted/60 ${card.accentColor}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="mt-3 space-y-1">
              <span className="text-xl font-black text-foreground tracking-tight font-mono block">
                {card.value}
              </span>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                <span>{card.sub}</span>
                <ArrowUpRight
                  className={`h-3.5 w-3.5 transition-transform ${
                    isActive ? 'text-primary translate-x-0.5 -translate-y-0.5' : 'opacity-40'
                  }`}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FuelKPICards;
