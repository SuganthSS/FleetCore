import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User } from 'lucide-react';
import type { Driver, CreateDriverPayload, ExperienceLevel, DriverAvailability } from '@/types/driver';

const driverSchema = z.object({
  employeeId: z.string().min(2, 'Employee ID must be at least 2 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  licenseNumber: z.string().min(3, 'License number is required'),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  experienceLevel: z.enum(['JUNIOR', 'MID', 'SENIOR', 'EXPERT']),
  availability: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'ON_LEAVE', 'SUSPENDED']),
  joiningDate: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

type DriverFormData = z.infer<typeof driverSchema>;

interface DriverModalProps {
  open: boolean;
  driver: Driver | null;
  onClose: () => void;
  onSubmit: (payload: CreateDriverPayload) => void;
  loading?: boolean;
}

export const DriverModal: React.FC<DriverModalProps> = ({
  open,
  driver,
  onClose,
  onSubmit,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: new Date().toISOString().split('T')[0],
      experienceLevel: 'MID',
      availability: 'AVAILABLE',
      joiningDate: new Date().toISOString().split('T')[0],
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  useEffect(() => {
    if (driver) {
      reset({
        employeeId: driver.employeeId,
        firstName: driver.user?.firstName || '',
        lastName: driver.user?.lastName || '',
        email: driver.user?.email || '',
        phone: driver.user?.phone || '',
        licenseNumber: driver.licenseNumber,
        licenseExpiry: driver.licenseExpiry.split('T')[0],
        experienceLevel: driver.experienceLevel,
        availability: driver.availability,
        joiningDate: driver.joiningDate ? driver.joiningDate.split('T')[0] : '',
        emergencyContactName: driver.emergencyContactName || '',
        emergencyContactPhone: driver.emergencyContactPhone || '',
      });
    } else {
      reset({
        employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        licenseNumber: `DL-${Math.floor(100000 + Math.random() * 900000)}`,
        licenseExpiry: '2028-12-31',
        experienceLevel: 'MID',
        availability: 'AVAILABLE',
        joiningDate: new Date().toISOString().split('T')[0],
        emergencyContactName: '',
        emergencyContactPhone: '',
      });
    }
  }, [driver, open, reset]);

  if (!open) return null;

  const handleFormSubmit = (data: DriverFormData) => {
    const payload: CreateDriverPayload = {
      employeeId: data.employeeId,
      firstName: data.firstName || undefined,
      lastName: data.lastName || undefined,
      email: data.email || undefined,
      phone: data.phone || null,
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      experienceLevel: data.experienceLevel as ExperienceLevel,
      availability: data.availability as DriverAvailability,
      joiningDate: data.joiningDate || null,
      emergencyContactName: data.emergencyContactName || null,
      emergencyContactPhone: data.emergencyContactPhone || null,
      companyId: '4044680601076201931',
    };
    onSubmit(payload);
  };

  const labelClass = "block text-xs font-bold text-foreground mb-1";
  const inputClass = "w-full rounded-lg border border-input bg-background px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                {driver ? 'Edit Driver Profile' : 'Add New Driver'}
              </h2>
              <p className="text-xs text-muted-foreground">
                Enter driver credentials, license info, and emergency contact details.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Employee ID *</label>
              <input {...register('employeeId')} className={inputClass} placeholder="e.g. EMP-104" />
              {errors.employeeId && <p className="text-[10px] text-destructive mt-0.5">{errors.employeeId.message}</p>}
            </div>

            <div>
              <label className={labelClass}>License Number *</label>
              <input {...register('licenseNumber')} className={inputClass} placeholder="e.g. DL-99201" />
              {errors.licenseNumber && <p className="text-[10px] text-destructive mt-0.5">{errors.licenseNumber.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>First Name</label>
              <input {...register('firstName')} className={inputClass} placeholder="John" />
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <input {...register('lastName')} className={inputClass} placeholder="Doe" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Email Address</label>
              <input {...register('email')} type="email" className={inputClass} placeholder="john.doe@fleetcore.com" />
              {errors.email && <p className="text-[10px] text-destructive mt-0.5">{errors.email.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input {...register('phone')} className={inputClass} placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>License Expiry *</label>
              <input {...register('licenseExpiry')} type="date" className={inputClass} />
              {errors.licenseExpiry && <p className="text-[10px] text-destructive mt-0.5">{errors.licenseExpiry.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Experience Level</label>
              <select {...register('experienceLevel')} className={inputClass}>
                <option value="JUNIOR">Junior (1-2 yrs)</option>
                <option value="MID">Mid Level (3-5 yrs)</option>
                <option value="SENIOR">Senior (5-8 yrs)</option>
                <option value="EXPERT">Expert (8+ yrs)</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Availability Status</label>
              <select {...register('availability')} className={inputClass}>
                <option value="AVAILABLE">Available</option>
                <option value="ON_TRIP">On Trip</option>
                <option value="OFF_DUTY">Off Duty</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Emergency Contact & Joining Date
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Emergency Contact Name</label>
                <input {...register('emergencyContactName')} className={inputClass} placeholder="Jane Doe (Spouse)" />
              </div>
              <div>
                <label className={labelClass}>Emergency Phone</label>
                <input {...register('emergencyContactPhone')} className={inputClass} placeholder="+1 (555) 111-2222" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Saving Driver...' : driver ? 'Save Changes' : 'Create Driver Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverModal;
