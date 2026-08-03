import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Save, CheckCircle2, Loader2, Mail, Smartphone, Wrench, Route, Fuel, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { settingsService } from '@/services/settings.service';
import type { NotificationSettings as NotificationSettingsType } from '@/types/settings';
import { SaveBar } from './SaveBar';

interface NotificationSettingsProps {
  initialData?: NotificationSettingsType;
  onRefresh?: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ initialData, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<NotificationSettingsType>({
    defaultValues: {
      emailNotifications: initialData?.emailNotifications ?? true,
      pushNotifications: initialData?.pushNotifications ?? true,
      maintenanceAlerts: initialData?.maintenanceAlerts ?? true,
      tripAlerts: initialData?.tripAlerts ?? true,
      fuelAlerts: initialData?.fuelAlerts ?? true,
      driverAlerts: initialData?.driverAlerts ?? true,
      aiAlerts: initialData?.aiAlerts ?? true,
    },
  });

  const values = watch();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const toggleField = (field: keyof NotificationSettingsType) => {
    setValue(field, !values[field], { shouldDirty: true });
  };

  const onSubmit = async (data: NotificationSettingsType) => {
    try {
      setIsSaving(true);
      setSuccessMsg(null);
      await settingsService.updateNotificationSettings(data);
      setSuccessMsg('Notification preferences updated successfully!');
      if (onRefresh) onRefresh();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      // Handled
    } finally {
      setIsSaving(false);
    }
  };

  const channels = [
    { key: 'emailNotifications' as const, title: 'Email Dispatch Notifications', desc: 'Receive real-time operational alerts directly via email.', icon: Mail },
    { key: 'pushNotifications' as const, title: 'Browser & Mobile Push Alerts', desc: 'Instant popup notifications on active web sessions and mobile apps.', icon: Smartphone },
  ];

  const alertCategories = [
    { key: 'maintenanceAlerts' as const, title: 'Maintenance Service Work Orders', desc: 'Overdue service, diagnostic fault codes, and repair reminders.', icon: Wrench },
    { key: 'tripAlerts' as const, title: 'Trip Dispatch & Geofence Breaches', desc: 'Unscheduled route deviations, trip delays, and arrival confirmations.', icon: Route },
    { key: 'fuelAlerts' as const, title: 'Fuel Theft & Rapid Consumption Drops', desc: 'Critical fuel level anomalies and static fuel drops.', icon: Fuel },
    { key: 'driverAlerts' as const, title: 'Driver Behavior & Safety Violations', desc: 'Harsh braking, speeding warnings, and license expiration notices.', icon: User },
    { key: 'aiAlerts' as const, title: 'Groq LPU Predictive AI Telemetry Flags', desc: 'Machine learning anomaly detection flags.', icon: Sparkles },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Notification & Alert Rules
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure delivery channels and domain specific event alerts for enterprise administrators.
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
            <span>Save Rules</span>
          </Button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Primary Channels */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2">
            1. Primary Delivery Channels
          </h4>

          <div className="space-y-2">
            {channels.map((ch) => {
              const Icon = ch.icon;
              const active = values[ch.key];
              return (
                <div key={ch.key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{ch.title}</h5>
                      <p className="text-[11px] text-muted-foreground">{ch.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleField(ch.key)}
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

        {/* Category Alerts */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2">
            2. Domain Specific System Alerts
          </h4>

          <div className="space-y-2">
            {alertCategories.map((cat) => {
              const Icon = cat.icon;
              const active = values[cat.key];
              return (
                <div key={cat.key} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">{cat.title}</h5>
                      <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleField(cat.key)}
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
export default NotificationSettings;
