import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { NotificationRecord, CreateNotificationPayload } from '@/types/notification';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';

interface SimpleUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface NotificationModalProps {
  open: boolean;
  record: NotificationRecord | null;
  onClose: () => void;
  onSubmit: (data: CreateNotificationPayload) => void;
  loading?: boolean;
  users: SimpleUser[];
}

const jsonValidator = z.string().refine((val) => {
  if (!val.trim()) return true;
  try {
    const parsed = JSON.parse(val);
    return typeof parsed === 'object' && parsed !== null;
  } catch {
    return false;
  }
}, { message: 'Invalid JSON format. Must be an object.' });

const notificationValidationSchema = z.object({
  userId: z.string().uuid('Please select a recipient user'),
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(150, 'Title must be 150 characters max'),
  message: z
    .string()
    .trim()
    .min(1, 'Message content is required')
    .max(1000, 'Message must be 1000 characters max'),
  type: z.enum(['SYSTEM', 'VEHICLE', 'DRIVER', 'TRIP', 'FUEL', 'MAINTENANCE', 'AI', 'FLEET']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  isRead: z.boolean(),
  metadataJson: jsonValidator,
});

type NotificationFormValues = z.infer<typeof notificationValidationSchema>;

export const NotificationModal: React.FC<NotificationModalProps> = ({
  open,
  record,
  onClose,
  onSubmit,
  loading = false,
  users,
}) => {
  const { user } = useAuth();
  const isEdit = !!record;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationValidationSchema),
    defaultValues: {
      userId: '',
      title: '',
      message: '',
      type: 'SYSTEM',
      priority: 'MEDIUM',
      isRead: false,
      metadataJson: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (record) {
        reset({
          userId: record.userId || '',
          title: record.title,
          message: record.message,
          type: record.type,
          priority: record.priority,
          isRead: record.isRead,
          metadataJson: record.metadata ? JSON.stringify(record.metadata, null, 2) : '',
        });
      } else {
        reset({
          userId: users[0]?.id || '',
          title: '',
          message: '',
          type: 'SYSTEM',
          priority: 'MEDIUM',
          isRead: false,
          metadataJson: '',
        });
      }
    }
  }, [open, record, reset, users]);

  if (!open) return null;

  const handleFormSubmit = (values: NotificationFormValues) => {
    let parsedMetadata: Record<string, any> | null = null;
    if (values.metadataJson.trim()) {
      try {
        parsedMetadata = JSON.parse(values.metadataJson);
      } catch {
        // Safe fallback as we validated it in Zod schema
      }
    }

    onSubmit({
      userId: values.userId,
      title: values.title,
      message: values.message,
      type: values.type,
      priority: values.priority,
      isRead: values.isRead,
      readAt: values.isRead ? new Date().toISOString() : null,
      metadata: parsedMetadata,
      companyId: record?.companyId || user?.companyId || '',
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
            {isEdit ? 'Modify Notification Log' : 'Create System Notification'}
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
          {/* Recipient User select */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recipient User
            </label>
            <select
              {...register('userId')}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select recipient...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName} ({u.email})
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="text-[10px] font-bold text-destructive mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>

          {/* Title */}
          <Input
            label="Notification Title"
            error={errors.title?.message}
            {...register('title')}
            placeholder="e.g. Low Fuel Level warning"
          />

          {/* Message Textarea */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Message Content
            </label>
            <textarea
              {...register('message')}
              rows={4}
              placeholder="Provide full text of the system notification message..."
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.message && (
              <p className="text-[10px] font-bold text-destructive mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Domain Type select */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Domain Type
              </label>
              <select
                {...register('type')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="SYSTEM">System</option>
                <option value="VEHICLE">Vehicle</option>
                <option value="DRIVER">Driver</option>
                <option value="TRIP">Trip</option>
                <option value="FUEL">Fuel</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="AI">AI Copilot</option>
                <option value="FLEET">Fleet Event</option>
              </select>
              {errors.type && (
                <p className="text-[10px] font-bold text-destructive mt-1">
                  {errors.type.message}
                </p>
              )}
            </div>

            {/* Priority level select */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Priority Level
              </label>
              <select
                {...register('priority')}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
              {errors.priority && (
                <p className="text-[10px] font-bold text-destructive mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Read Status Switch */}
          <div className="flex items-center gap-3 py-2 text-left">
            <input
              type="checkbox"
              id="isRead"
              {...register('isRead')}
              className="h-4.5 w-4.5 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isRead" className="text-xs font-bold text-foreground cursor-pointer select-none">
              Mark immediately as read by recipient
            </label>
          </div>

          {/* Optional JSON metadata textbox */}
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Optional JSON Metadata
            </label>
            <textarea
              {...register('metadataJson')}
              rows={3}
              placeholder='{ "key": "value" }'
              className="flex w-full rounded-lg border border-input bg-background px-3 py-2 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.metadataJson && (
              <p className="text-[10px] font-bold text-destructive mt-1">
                {errors.metadataJson.message}
              </p>
            )}
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
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Notification'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NotificationModal;
