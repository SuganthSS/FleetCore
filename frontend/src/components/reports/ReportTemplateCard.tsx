import React from 'react';
import { Play, Star } from 'lucide-react';
import type { ReportCategory } from './ReportsToolbar';

export interface ReportTemplate {
  id: string;
  category: ReportCategory;
  title: string;
  description: string;
  format: 'CSV' | 'EXCEL' | 'PDF';
  estimatedTime: string;
  popular?: boolean;
}

interface ReportTemplateCardProps {
  template: ReportTemplate;
  onGenerate: (template: ReportTemplate) => void;
  onPreview: (template: ReportTemplate) => void;
}

export const ReportTemplateCard: React.FC<ReportTemplateCardProps> = ({
  template,
  onGenerate,
  onPreview,
}) => {
  return (
    <div className="flex flex-col justify-between p-4 rounded-2xl border border-border bg-card shadow-2xs hover:shadow-xs transition-all space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono text-[10px] font-bold">
            {template.category}
          </span>
          <div className="flex items-center gap-1.5">
            {template.popular && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[9px] font-bold">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Popular
              </span>
            )}
            <span className="text-[10px] font-mono text-muted-foreground font-semibold">
              {template.format}
            </span>
          </div>
        </div>

        <h4 className="text-sm font-bold text-foreground leading-snug">{template.title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {template.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
        <span className="text-[10px] text-muted-foreground font-mono">
          Est. Generation: {template.estimatedTime}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPreview(template)}
            className="px-2.5 py-1.5 rounded-xl border border-input bg-card text-foreground font-bold text-xs hover:bg-muted transition-colors"
          >
            Preview
          </button>
          <button
            onClick={() => onGenerate(template)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors shadow-2xs"
          >
            <Play className="h-3 w-3 fill-white" />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportTemplateCard;
