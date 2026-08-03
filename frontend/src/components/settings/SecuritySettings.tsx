import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ShieldCheck, Save, CheckCircle2, Loader2, Key, Clock, Smartphone, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { settingsService } from '@/services/settings.service';
import type { SecuritySettings as SecuritySettingsType } from '@/types/settings';
import { SaveBar } from './SaveBar';

interface SecuritySettingsProps {
  initialData?: SecuritySettingsType;
  onRefresh?: () => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ initialData, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<SecuritySettingsType>({
    defaultValues: {
      passwordPolicy: initialData?.passwordPolicy || 'strict',
      sessionTimeoutMinutes: initialData?.sessionTimeoutMinutes || 60,
      twoFactorAuth: initialData?.twoFactorAuth ?? true,
      allowedLoginDevices: initialData?.allowedLoginDevices || ['Desktop', 'Mobile App v4.1', 'Tablet'],
      apiKeys: initialData?.apiKeys || [
        {
          id: 'key_live_90412894',
          name: 'FleetCore Telematics Production Gateway',
          prefix: 'fl_live_9041...',
          createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          status: 'ACTIVE',
        },
        {
          id: 'key_test_10482012',
          name: 'Third-party ERP Integration Sandbox',
          prefix: 'fl_test_1048...',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastUsed: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
          status: 'ACTIVE',
        },
      ],
    },
  });

  const twoFactorAuth = watch('twoFactorAuth');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: SecuritySettingsType) => {
    try {
      setIsSaving(true);
      setSuccessMsg(null);
      await settingsService.updateSecuritySettings(data);
      setSuccessMsg('Security policy rules updated!');
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
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Security & Authorization Policies
              </h3>
              <p className="text-xs text-muted-foreground">
                Enterprise password standards, session timeout limits, 2FA requirements, and API credentials.
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
            <span>Save Policies</span>
          </Button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Password Policy & Session Timeout */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-primary" />
            <span>Authentication Rules</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Password Complexity Policy</label>
              <select
                {...register('passwordPolicy')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="standard">Standard (8+ chars, 1 number)</option>
                <option value="strict">Strict (12+ chars, uppercase, symbol, number)</option>
                <option value="enterprise">Enterprise (16+ chars, 90-day rotation, 2FA mandatory)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" /> Inactivity Session Timeout (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={1440}
                {...register('sessionTimeoutMinutes', { valueAsNumber: true })}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication Toggle */}
        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Smartphone className="h-4.5 w-4.5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-foreground">Multi-Factor Authentication (2FA)</h5>
                <p className="text-[11px] text-muted-foreground">Mandatory TOTP authenticator prompt for all Administrator and Manager logins.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setValue('twoFactorAuth', !twoFactorAuth, { shouldDirty: true })}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                twoFactorAuth ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  twoFactorAuth ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Read-Only API Keys */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-primary" />
            <span>Active API Gateway Keys (Read-Only)</span>
          </h4>

          <div className="space-y-2">
            {(watch('apiKeys') || []).map((key) => (
              <div key={key.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-border bg-background text-xs">
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    <span>{key.name}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      {key.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    Prefix: {key.prefix}
                  </div>
                </div>
                <div className="text-right text-[11px] text-muted-foreground">
                  <div>Created: {new Date(key.createdAt).toLocaleDateString()}</div>
                  <div>Last used: {new Date(key.lastUsed).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
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
export default SecuritySettings;
