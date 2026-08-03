import React from 'react';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';

export const AISkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-16 rounded-2xl bg-muted/60" />
      <div className="h-44 rounded-2xl bg-muted/60" />
      <div className="h-64 rounded-2xl bg-muted/60" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-56 rounded-2xl bg-muted/60" />
        <div className="h-56 rounded-2xl bg-muted/60" />
      </div>
    </div>
  );
};

export const AIEmptyState: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
    </div>
  );
};

export const AIErrorState: React.FC<{
  title: string;
  description: string;
  onRetry: () => void;
}> = ({ title, description, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/5 p-12 text-center space-y-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500">
        <AlertCircle className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-md">{description}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Retry Processing
      </button>
    </div>
  );
};
