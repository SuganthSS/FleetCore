import React from 'react';
import { Save, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaveBarProps {
  show: boolean;
  isSaving: boolean;
  onSave: () => void;
  onReset: () => void;
}

export const SaveBar: React.FC<SaveBarProps> = ({
  show,
  isSaving,
  onSave,
  onReset,
}) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[480px] bg-foreground text-background dark:bg-card dark:text-card-foreground border border-border p-4 rounded-xl shadow-2xl z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-200">
      <div className="text-left">
        <p className="text-xs font-bold">Unsaved Changes Detected</p>
        <p className="text-[11px] opacity-80">You have modified setting preferences. Save your changes before navigating away.</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isSaving}
          onClick={onReset}
          className="h-8 px-3 text-xs gap-1 font-semibold dark:border-border"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isSaving}
          onClick={onSave}
          className="h-8 px-3 text-xs gap-1.5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
        >
          {isSaving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </Button>
      </div>
    </div>
  );
};
export default SaveBar;
