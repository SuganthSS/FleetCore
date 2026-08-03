import React from 'react';
import { Lightbulb, DollarSign, CheckCircle2 } from 'lucide-react';
import { AIInsightsData } from '@/services/aiCopilot.service';

interface RecommendationsCardProps {
  recommendations: AIInsightsData['recommendations'];
  onApply: (recId: string) => void;
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  recommendations,
  onApply,
}) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Operational Recommendations</h2>
          <p className="text-xs text-muted-foreground">Prioritized AI action items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-background p-4 space-y-3 hover:border-primary/50 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-purple-500/10 px-2 py-0.5 text-[10px] font-extrabold text-purple-600 dark:text-purple-400">
                  {rec.category}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                  <DollarSign className="h-3 w-3" /> {rec.potentialSavings}
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground leading-snug">{rec.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-3">{rec.description}</p>
            </div>

            <button
              onClick={() => onApply(rec.id)}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> Apply Recommendation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
