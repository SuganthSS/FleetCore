import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { Driver, CreateDriverPayload } from '@/types/driver';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface DriverModalProps {
  open: boolean;
  driver: Driver | null;
  onClose: () => void;
  onSubmit: (data: CreateDriverPayload) => void;
  loading?: boolean;
}

const driverValidationSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(1, 'Employee ID is required')
    .max(50, 'Employee ID must be 50 characters max'),
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters max'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters max'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address format'),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone must be 30 characters max')
    .optional()
    .nullable(),
  licenseNumber: z
    .string()
    .trim()
    .min(1, 'License number is required')
    .max(50, 'License number must be 50 characters max'),
  licenseExpiry: z.string().min(1, 'License expiry date is required'),
  joiningDate: z.string().optional().nullable(),
  experienceLevel: z.enum(['JUNIOR', 'MID', 'SENIOR', 'EXPERT']),
  availability: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'ON_LEAVE', 'SUSPENDED']),
  emergencyContactName: z
    .string()
    .trim()
    .max(100, 'Emergency contact name must be 100 characters max')
    .optional()
    .nullable(),
  emergencyContactPhone: z
    .string()
    .trim()
    .max(20, 'Emergency contact phone must be 20 characters max')
    .optional()
    .nullable(),
});

type DriverFormValues = z.infer<typeof driverValidationSchema>;

export const DriverModal: React.FC<DriverModalProps> = ({
  open,
  driver,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const { user } = useAuth();
  const isEdit = !!driver;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverValidationSchema),
    defaultValues: {
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      licenseNumber: '',
      licenseExpiry: '',
      joiningDate: '',
      experienceLevel: 'MID',
      availability: 'AVAILABLE',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (driver) {
        // Format ISO date to YYYY-MM-DD for form input
        const formatInputDate = (dateStr?: string | null) => {
          if (!dateStr) return '';
          return new Date(dateStr).toISOString().split('T')[0];
        };

        reset({
          employeeId: driver.employeeId,
          firstName: driver.user?.firstName || '',
          lastName: driver.user?.lastName || '',
          email: driver.user?.email || '',
          phone: driver.user?.phone || '',
          licenseNumber: driver.licenseNumber,
          licenseExpiry: formatInputDate(driver.licenseExpiry),
          joiningDate: formatInputDate(driver.joiningDate),
          experienceLevel: driver.experienceLevel,
          availability: driver.availability,
          emergencyContactName: driver.emergencyContactName || '',
          emergencyContactPhone: driver.emergencyContactPhone || '',
        });
      } else {
        reset({
          employeeId: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          licenseExpiry: '',
          joiningDate: new Date().toISOString().split('T')[0],
          experienceLevel: 'MID',
          availability: 'AVAILABLE',
          emergencyContactName: '',
          emergencyContactPhone: '',
        });
      }
    }
  }, [open, driver, reset]);

  if (!open) return null;

  const handleFormSubmit = (values: DriverFormValues) => {
    onSubmit({
      ...values,
      joiningDate: values.joiningDate || null,
      emergencyContactName: values.emergencyContactName || null,
      emergencyContactPhone: values.emergencyContactPhone || null,
      companyId: driver?.companyId || user?.companyId || '',
      userId: driver?.userId || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl z-10 animate-scale-up max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
          <h2 className="text-lg font-bold text-foreground">
            {isEdit ? 'Edit Driver' : 'Add Driver'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Employee ID */}
            <Input
              label="Employee ID"
              error={errors.employeeId?.message}
              {...register('employeeId')}
              placeholder="e.g. EMP-101"
            />

            {/* Phone Number */}
            <Input
              label="Phone Number"
              error={errors.phone?.message}
              {...register('phone')}
              placeholder="e.g. +1-555-0100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <Input
              label="First Name"
              error={errors.firstName?.message}
              {...register('firstName')}
              placeholder="First name"
            />

            {/* Last Name */}
            <Input
              label="Last Name"
              error={errors.lastName?.message}
              {...register('lastName')}
              placeholder="Last name"
            />
          </div>

          {/* Email Address */}
          <Input
            label="Email Address"
            type="email"
            error={errors.email?.message}
            {...register('email')}
            placeholder="e.g. driver@company.com"
          />

          <div className="grid grid-cols-2 gap-4">
            {/* License Number */}
            <Input
              label="License Number"
              error={errors.licenseNumber?.message}
              {...register('licenseNumber')}
              placeholder="e.g. DL-12345"
            />

            {/* License Expiry */}
            <Input
              label="License Expiry"
              type="date"
              error={errors.licenseExpiry?.message}
              {...register('licenseExpiry')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Experience Level */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Experience Level
              </label>
              <select
                {...register('experienceLevel')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid</option>
                <option value="SENIOR">Senior</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            {/* Availability */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Availability
              </label>
              <select
                {...register('availability')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="AVAILABLE">Available</option>
                <option value="ON_TRIP">On Trip</option>
                <option value="OFF_DUTY">Off Duty</option>
                <option value="ON_LEAVE">On Leave</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Joining Date */}
            <Input
              label="Joining Date"
              type="date"
              error={errors.joiningDate?.message}
              {...register('joiningDate')}
            />

            {/* Empty space or another field if needed */}
            <div className="space-y-1.5" />
          </div>

          <div className="border-t border-border pt-3 mt-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Emergency Contact Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Emergency Contact Name */}
              <Input
                label="Contact Name"
                error={errors.emergencyContactName?.message}
                {...register('emergencyContactName')}
                placeholder="Name"
              />

              {/* Emergency Contact Phone */}
              <Input
                label="Contact Phone"
                error={errors.emergencyContactPhone?.message}
                {...register('emergencyContactPhone')}
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : isEdit ? 'Save Changes' : 'Add Driver'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default DriverModal;
