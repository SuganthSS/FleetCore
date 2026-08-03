import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Sliders, Save, CheckCircle2, Loader2, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { settingsService } from '@/services/settings.service';
import type { GeneralSettings as GeneralSettingsType } from '@/types/settings';
import { SaveBar } from './SaveBar';

interface GeneralSettingsProps {
  initialData?: GeneralSettingsType;
  onRefresh?: () => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ initialData, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<GeneralSettingsType>({
    defaultValues: {
      theme: initialData?.theme || 'light',
      accentColor: initialData?.accentColor || '#004ac6',
      dateFormat: initialData?.dateFormat || 'YYYY-MM-DD',
      timeFormat: initialData?.timeFormat || '24h',
      measurementUnits: initialData?.measurementUnits || 'metric',
      distanceUnits: initialData?.distanceUnits || 'km',
      weightUnits: initialData?.weightUnits || 'kg',
      fuelUnits: initialData?.fuelUnits || 'liters',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: GeneralSettingsType) => {
    try {
      setIsSaving(true);
      setSuccessMsg(null);
      await settingsService.updateGeneralSettings(data);
      setSuccessMsg('General preferences saved successfully!');
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
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                General System Preferences
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure measurement units, telemetry formatting, and date/time standards.
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
            <span>Save Preferences</span>
          </Button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Units Configuration */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            <span>Telemetry & Measurement Units</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Standard System Units</label>
              <select
                {...register('measurementUnits')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="metric">Metric System (Kilometers, Kilograms, Liters)</option>
                <option value="imperial">Imperial System (Miles, Pounds, Gallons)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Distance Unit</label>
              <select
                {...register('distanceUnits')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="km">Kilometers (km)</option>
                <option value="mi">Miles (mi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Cargo Weight Unit</label>
              <select
                {...register('weightUnits')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="tons">Metric Tons (t)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Fuel Volume Unit</label>
              <select
                {...register('fuelUnits')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="liters">Liters (L)</option>
                <option value="gallons">US Gallons (gal)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time Formatting */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2">
            Date & Time Formatting
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Date Format Standard</label>
              <select
                {...register('dateFormat')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="YYYY-MM-DD">ISO Standard (YYYY-MM-DD)</option>
                <option value="MM/DD/YYYY">US Standard (MM/DD/YYYY)</option>
                <option value="DD/MM/YYYY">European (DD/MM/YYYY)</option>
                <option value="DD MMM YYYY">Descriptive (04 Aug 2026)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Time Clock Format</label>
              <select
                {...register('timeFormat')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="24h">24-Hour International Clock (14:30)</option>
                <option value="12h">12-Hour Clock (02:30 PM)</option>
              </select>
            </div>
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
export default GeneralSettings;
