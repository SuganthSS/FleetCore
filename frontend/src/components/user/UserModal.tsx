import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import type { UserItem, CreateUserInput, UpdateUserInput, UserStatus } from '@/types/user';

// Zod Schema for validation
const userFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: 'Password must be at least 6 characters if provided',
    }),
  phone: z.string().optional(),
  roleId: z.string().min(1, 'Please select a role'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']),
});

export type UserFormData = z.infer<typeof userFormSchema>;


interface UserModalProps {
  isOpen: boolean;
  userToEdit: UserItem | null;
  roles: { id: string; name: string }[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  userToEdit,
  roles,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const isEditing = Boolean(userToEdit);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      roleId: '',
      status: 'ACTIVE',
    },
  });

  useEffect(() => {
    if (userToEdit) {
      reset({
        firstName: userToEdit.firstName,
        lastName: userToEdit.lastName,
        email: userToEdit.email,
        password: '',
        phone: userToEdit.phone || '',
        roleId: userToEdit.roleId,
        status: userToEdit.status,
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        roleId: roles.length > 0 ? roles[0].id : '',
        status: 'ACTIVE',
      });
    }
  }, [userToEdit, roles, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (formData: UserFormData) => {
    const payload: CreateUserInput | UpdateUserInput = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || undefined,
      roleId: formData.roleId,
      status: formData.status as UserStatus,
    };

    if (!isEditing && formData.password) {
      (payload as CreateUserInput).password = formData.password;
    }

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#c3c6d7] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
        <div className="p-5 border-b border-[#e5eeff] flex justify-between items-center bg-[#f8f9ff]">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
              {isEditing ? 'Edit Employee Profile' : 'Add New Enterprise Employee'}
            </h3>
            <p className="font-['Inter'] text-xs text-[#737686]">
              {isEditing
                ? 'Update credentials, roles, and status.'
                : 'Create an internal employee profile with RBAC access.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737686] hover:bg-[#e5eeff] hover:text-[#0b1c30] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 font-['Inter'] text-xs">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">First Name *</label>
              <input
                type="text"
                {...register('firstName')}
                placeholder="e.g. John"
                className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
              />
              {errors.firstName && (
                <p className="text-[#ba1a1a] text-[11px] mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Last Name *</label>
              <input
                type="text"
                {...register('lastName')}
                placeholder="e.g. Doe"
                className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
              />
              {errors.lastName && (
                <p className="text-[#ba1a1a] text-[11px] mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Email Address *</label>
              <input
                type="email"
                {...register('email')}
                placeholder="john.doe@fleetcore.com"
                className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
              />
              {errors.email && (
                <p className="text-[#ba1a1a] text-[11px] mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Phone Number</label>
              <input
                type="text"
                {...register('phone')}
                placeholder="+1 (555) 019-2834"
                className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
              />
            </div>
          </div>

          {/* Initial Password (only for new users) */}
          {!isEditing && (
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Initial Password *</label>
              <input
                type="password"
                {...register('password')}
                placeholder="Minimum 6 characters"
                className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none"
              />
              {errors.password && (
                <p className="text-[#ba1a1a] text-[11px] mt-1">{errors.password.message}</p>
              )}
            </div>
          )}

          {/* Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Enterprise Role *</label>
              <select
                {...register('roleId')}
                className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none bg-white"
              >
                <option value="">Select a Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-[#ba1a1a] text-[11px] mt-1">{errors.roleId.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-[#0b1c30] mb-1">Account Status</label>
              <select
                {...register('status')}
                className="w-full h-9 px-3 rounded-xl border border-[#c3c6d7] text-xs text-[#0b1c30] focus:ring-2 focus:ring-[#004ac6] focus:outline-none bg-white"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#e5eeff] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[#c3c6d7] text-xs font-semibold text-[#434655] hover:bg-[#f8f9ff] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 rounded-xl bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003ea8] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
