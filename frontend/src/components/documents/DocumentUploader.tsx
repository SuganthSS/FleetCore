import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';

interface DocumentUploaderProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, category: string, tags: string[]) => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({ open, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('VEHICLE');
  const [tagsInput, setTagsInput] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onUpload(file, category, tags);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Upload className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Upload Document</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* File Dropzone */}
          <div className="rounded-2xl border-2 border-dashed border-border bg-background p-6 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </div>
            {file ? (
              <div className="space-y-1">
                <span className="font-bold text-foreground block">{file.name}</span>
                <span className="text-[11px] text-muted-foreground block">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            ) : (
              <div>
                <span className="font-bold text-foreground block">Click to choose a file</span>
                <span className="text-[11px] text-muted-foreground">PDF, DOCX, XLSX, PNG, JPG (Max 25MB)</span>
              </div>
            )}
            <input
              type="file"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
              className="hidden"
              id="file-upload-input"
              required
            />
            <label
              htmlFor="file-upload-input"
              className="inline-block mt-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground cursor-pointer hover:bg-muted"
            >
              Browse Local Files
            </label>
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="VEHICLE">Vehicle Document</option>
              <option value="DRIVER">Driver License / Certification</option>
              <option value="TRIP">Trip Manifest / Delivery Proof</option>
              <option value="SHIPMENT">Shipment Waybill</option>
              <option value="MAINTENANCE">Work Order Invoice</option>
              <option value="COMPLIANCE">Safety & Compliance Audit</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-muted-foreground block mb-1">Tags (Comma-separated)</label>
            <input
              type="text"
              placeholder="e.g. registration, 2026, volvo"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" /> Start Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
