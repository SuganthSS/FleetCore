import React, { useRef, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyLogoUploaderProps {
  currentLogoUrl?: string;
  onLogoUpdated: (newLogoUrl?: string) => void;
  isUploading?: boolean;
  onUploadFile: (file: File) => Promise<void>;
  onDeleteLogo: () => Promise<void>;
}

export const CompanyLogoUploader: React.FC<CompanyLogoUploaderProps> = ({
  currentLogoUrl,
  onLogoUpdated,
  onUploadFile,
  onDeleteLogo,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'].includes(file.type)) {
      setErrorMsg('Invalid file format. Please upload PNG, JPG, WEBP, or SVG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      await onUploadFile(file);
      setSuccessMsg('Company logo updated via Cloudinary!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Failed to upload image to Cloudinary.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await onDeleteLogo();
      onLogoUpdated(undefined);
      setSuccessMsg('Logo removed.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Failed to remove logo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl border border-border bg-card/60">
      <div className="relative group shrink-0">
        <div className="h-20 w-20 rounded-xl border-2 border-border/80 bg-muted/30 overflow-hidden flex items-center justify-center shadow-xs">
          {currentLogoUrl ? (
            <img
              src={currentLogoUrl}
              alt="Company Logo"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-8 w-8 text-muted-foreground/60" />
          )}
        </div>
        {loading && (
          <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center backdrop-blur-xs">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        )}
      </div>

      <div className="flex-1 text-left space-y-1.5">
        <h4 className="text-xs font-bold text-foreground tracking-tight">
          Company Logo
        </h4>
        <p className="text-xs text-muted-foreground">
          Recommended resolution 256x256px. PNG, JPG, or WEBP up to 5MB. Directly hosted on Cloudinary Asset Hub.
        </p>

        {errorMsg && (
          <div className="flex items-center gap-1.5 text-xs text-destructive font-medium pt-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 px-3 text-xs gap-1.5 font-semibold"
          >
            <Upload className="h-3.5 w-3.5 text-primary" />
            <span>{currentLogoUrl ? 'Replace Logo' : 'Upload Logo'}</span>
          </Button>

          {currentLogoUrl && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={loading}
              onClick={handleDelete}
              className="h-8 px-3 text-xs gap-1.5 font-semibold"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default CompanyLogoUploader;
