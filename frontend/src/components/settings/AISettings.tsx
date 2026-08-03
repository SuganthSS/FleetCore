import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Sparkles, Save, CheckCircle2, Loader2, Cpu, SlidersHorizontal, ShieldAlert, Navigation, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { settingsService } from '@/services/settings.service';
import type { AISettings as AISettingsType } from '@/types/settings';
import { SaveBar } from './SaveBar';

interface AISettingsProps {
  initialData?: AISettingsType;
  onRefresh?: () => void;
}

export const AISettings: React.FC<AISettingsProps> = ({ initialData, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<AISettingsType>({
    defaultValues: {
      provider: initialData?.provider || 'Groq',
      model: initialData?.model || 'llama-3.3-70b-versatile',
      temperature: initialData?.temperature ?? 0.7,
      maxTokens: initialData?.maxTokens || 4096,
      streaming: initialData?.streaming ?? true,
      aiAssistant: initialData?.aiAssistant ?? true,
      routeOptimization: initialData?.routeOptimization ?? true,
      maintenancePrediction: initialData?.maintenancePrediction ?? true,
      riskAnalysis: initialData?.riskAnalysis ?? true,
    },
  });

  const values = watch();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const toggleField = (field: keyof AISettingsType) => {
    setValue(field, !values[field], { shouldDirty: true });
  };

  const onSubmit = async (data: AISettingsType) => {
    try {
      setIsSaving(true);
      setSuccessMsg(null);
      await settingsService.updateAISettings(data);
      setSuccessMsg('Groq AI LPU model configuration updated!');
      if (onRefresh) onRefresh();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      // Handled
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Groq AI LPU & Intelligence Settings
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure Groq sub-second model parameters, tokens, and active automated fleet copilots.
              </p>
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving}
            className="h-8 px-3.5 text-xs gap-1.5 font-semibold"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>Save AI Specs</span>
          </Button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Model Selection */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-primary" />
            <span>1. Inference Engine Specs</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">AI Provider</label>
              <select
                {...register('provider')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Groq">Groq LPU (Sub-Second Fast Inference)</option>
                <option value="OpenAI">OpenAI Enterprise API</option>
                <option value="Anthropic">Anthropic Claude 3.5</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Inference Model</label>
              <select
                {...register('model')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                <option value="gemma2-9b-it">gemma2-9b-it</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1 flex items-center justify-between">
                <span>Creativity / Temperature</span>
                <span className="font-mono text-primary">{values.temperature}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                {...register('temperature', { valueAsNumber: true })}
                className="w-full accent-primary h-2 bg-muted rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Max Output Token Limit</label>
              <input
                type="number"
                min={100}
                max={32000}
                {...register('maxTokens', { valueAsNumber: true })}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* AI Modules Toggles */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
            <span>2. FleetCore Copilots & Features</span>
          </h4>

          <div className="space-y-2">
            {[
              { key: 'aiAssistant' as const, title: 'Global Fleet AI Assistant', desc: 'Natural language queries across trips, fuel logs, and vehicles.', icon: Sparkles },
              { key: 'routeOptimization' as const, title: 'AI Automated Route Optimization', desc: 'Predictive traffic and distance optimization for shipments.', icon: Navigation },
              { key: 'maintenancePrediction' as const, title: 'Predictive Vehicle Diagnostics', desc: 'Early warning engine failure and maintenance forecasting.', icon: Wrench },
              { key: 'riskAnalysis' as const, title: 'Real-time Driver Safety Risk Scoring', desc: 'Continuous safety evaluation based on telemetry metrics.', icon: ShieldAlert },
            ].map((feat) => {
              const Icon = feat.icon;
              const active = values[feat.key];
              return (
                <div key={feat.key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{feat.title}</h5>
                      <p className="text-[11px] text-muted-foreground">{feat.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleField(feat.key)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      active ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        active ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <SaveBar
        show={isDirty}
        isSaving={isSaving}
        onSave={handleSubmit(onSubmit)}
        onReset={() => reset()}
      />
    </form>
  );
};
export default AISettings;
