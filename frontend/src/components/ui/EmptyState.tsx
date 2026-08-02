import React from 'react';
import { InboxIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'There is nothing to display here yet.',
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center',
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <InboxIcon className="h-8 w-8" />}
      </div>
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
