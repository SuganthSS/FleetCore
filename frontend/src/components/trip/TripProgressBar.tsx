import React from 'react';

interface TripProgressBarProps {
  progress?: number;
  status?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md';
}

export const TripProgressBar: React.FC<TripProgressBarProps> = ({
  progress = 0,
  status = 'SCHEDULED',
  showPercentage = true,
  size = 'md',
}) => {
  const getProgressColor = () => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500';
      case 'IN_TRANSIT':
        return 'bg-indigo-500';
      case 'DISPATCHED':
        return 'bg-blue-500';
      case 'PAUSED':
        return 'bg-amber-500';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-rose-500';
      default:
        return 'bg-slate-400';
    }
  };

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-muted-foreground">Progress</span>
        {showPercentage && (
          <span className="font-mono font-bold text-foreground">{clampedProgress}%</span>
        )}
      </div>
      <div
        className={`w-full rounded-full bg-muted/60 overflow-hidden border border-border/40 ${
          size === 'sm' ? 'h-1.5' : 'h-2.5'
        }`}
      >
        <div
          className={`h-full transition-all duration-500 rounded-full ${getProgressColor()}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default TripProgressBar;
