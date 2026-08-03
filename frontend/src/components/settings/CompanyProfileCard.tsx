import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Save, CheckCircle2, Loader2, Globe, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { settingsService } from '@/services/settings.service';
import type { CompanyProfile } from '@/types/settings';
import { CompanyLogoUploader } from './CompanyLogoUploader';
import { SaveBar } from './SaveBar';

const schema = z.object({
  organizationName: z.string().min(2, 'Organization Name is required'),
  legalName: z.string().optional(),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  industry: z.string().optional(),
  fleetSize: z.string().optional(),
  primaryEmail: z.string().email('Invalid primary email'),
  supportEmail: z.string().email('Invalid support email').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  businessHours: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CompanyProfileCardProps {
  initialData?: CompanyProfile;
  onRefresh?: () => void;
}

export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({ initialData, onRefresh }) => {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(initialData?.logoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      organizationName: initialData?.organizationName || 'FleetCore Logistics',
      legalName: initialData?.legalName || 'FleetCore Global Logistics Solutions Inc.',
      registrationNumber: initialData?.registrationNumber || 'REG-2026-890214',
      taxId: initialData?.taxId || 'US-890412359-TX',
      industry: initialData?.industry || 'Freight & Logistics Transport',
      fleetSize: initialData?.fleetSize || '150+ Heavy & Light Duty Commercial Assets',
      primaryEmail: initialData?.primaryEmail || 'admin@fleetcore.io',
      supportEmail: initialData?.supportEmail || 'support@fleetcore.io',
      phone: initialData?.phone || '+1 (800) 555-3533',
      website: initialData?.website || 'https://fleetcore.io',
      address: initialData?.address || '100 Enterprise Boulevard, Suite 400',
      country: initialData?.country || 'United States',
      state: initialData?.state || 'Illinois',
      city: initialData?.city || 'Chicago',
      postalCode: initialData?.postalCode || '60601',
      timezone: initialData?.timezone || 'America/Chicago (UTC-6)',
      language: initialData?.language || 'English (US)',
      currency: initialData?.currency || 'USD ($)',
      businessHours: initialData?.businessHours || 'Mon - Fri: 08:00 - 18:00 CST',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setLogoUrl(initialData.logoUrl);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true);
      setSuccessMsg(null);
      await settingsService.updateCompanyProfile({ ...data, logoUrl });
      setSuccessMsg('Company profile updated successfully!');
      if (onRefresh) onRefresh();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      // Handled
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadLogo = async (file: File) => {
    const res = await settingsService.uploadCompanyLogo(file);
    setLogoUrl(res.logoUrl);
    if (onRefresh) onRefresh();
  };

  const handleDeleteLogo = async () => {
    await settingsService.deleteCompanyLogo();
    setLogoUrl(undefined);
    if (onRefresh) onRefresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground tracking-tight">
                Organization Profile
              </h3>
              <p className="text-xs text-muted-foreground">
                Primary corporate details, branding, tax identification, and office contact information.
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
            <span>Save Profile</span>
          </Button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Logo Upload Component */}
        <CompanyLogoUploader
          currentLogoUrl={logoUrl}
          onLogoUpdated={setLogoUrl}
          onUploadFile={handleUploadLogo}
          onDeleteLogo={handleDeleteLogo}
        />

        {/* Form Grid Section 1: General Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2">
            1. Corporate Identification
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Organization Name *</label>
              <input
                {...register('organizationName')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.organizationName && <p className="text-[11px] text-destructive mt-1">{errors.organizationName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Legal Registered Name</label>
              <input
                {...register('legalName')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Registration / Commercial Number</label>
              <input
                {...register('registrationNumber')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Tax ID / VAT Registration</label>
              <input
                {...register('taxId')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Industry Sector</label>
              <input
                {...register('industry')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Fleet Asset Capacity</label>
              <input
                {...register('fleetSize')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Form Grid Section 2: Contact Information */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-primary" />
            <span>2. Communications & Contact</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Primary Email Address *</label>
              <input
                {...register('primaryEmail')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              {errors.primaryEmail && <p className="text-[11px] text-destructive mt-1">{errors.primaryEmail.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Support Email Address</label>
              <input
                {...register('supportEmail')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                <Phone className="h-3 w-3 text-muted-foreground" /> Phone Contact
              </label>
              <input
                {...register('phone')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
                <Globe className="h-3 w-3 text-muted-foreground" /> Website URL
              </label>
              <input
                {...register('website')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Form Grid Section 3: Headquarters Address */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>3. Headquarters Location</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">Street Address</label>
              <input
                {...register('address')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">City</label>
              <input
                {...register('city')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">State / Province</label>
              <input
                {...register('state')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Postal / Zip Code</label>
              <input
                {...register('postalCode')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Country</label>
              <input
                {...register('country')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Form Grid Section 4: Localization & Operating Hours */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-border/60 pb-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>4. Localization & Business Schedule</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Default Timezone</label>
              <input
                {...register('timezone')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Primary Language</label>
              <input
                {...register('language')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Base Currency</label>
              <input
                {...register('currency')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Operational Hours</label>
              <input
                {...register('businessHours')}
                className="w-full h-9 px-3 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
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
export default CompanyProfileCard;
