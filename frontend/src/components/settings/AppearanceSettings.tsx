import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Laptop, Sparkles } from 'lucide-react';

export const AppearanceSettings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
  });

  const [accent, setAccent] = useState<'orange' | 'blue'>(() => {
    return (localStorage.getItem('accent') as 'orange' | 'blue') || 'orange';
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = (t: 'light' | 'dark' | 'system') => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else if (t === 'light') {
        root.classList.remove('dark');
      } else {
        // System
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSave = () => {
    localStorage.setItem('accent', accent);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 text-left space-y-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-2">
        <Palette className="h-4.5 w-4.5 text-primary" />
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          Visual Customization
        </h3>
      </div>

      {/* Theme Select */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Interface Mode
        </label>
        <div className="grid grid-cols-3 gap-3">
          {/* Light */}
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
              theme === 'light'
                ? 'border-primary bg-primary/5 text-primary shadow-xs font-bold'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <Sun className="h-5 w-5" />
            <span className="text-xs">Light</span>
          </button>

          {/* Dark */}
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
              theme === 'dark'
                ? 'border-primary bg-primary/5 text-primary shadow-xs font-bold'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <Moon className="h-5 w-5" />
            <span className="text-xs">Dark Mode</span>
          </button>

          {/* System */}
          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
              theme === 'system'
                ? 'border-primary bg-primary/5 text-primary shadow-xs font-bold'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <Laptop className="h-5 w-5" />
            <span className="text-xs">System</span>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Brand Accent Color
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setAccent('orange')}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
              accent === 'orange'
                ? 'border-orange-500 bg-orange-500/5 text-orange-600'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="h-3 w-3 rounded-full bg-orange-500" />
            Fleet Orange
          </button>
          <button
            onClick={() => setAccent('blue')}
            className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold transition-all ${
              accent === 'blue'
                ? 'border-blue-500 bg-blue-500/5 text-blue-600'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="h-3 w-3 rounded-full bg-blue-500" />
            Ocean Blue
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
        {saved ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles className="h-4 w-4 animate-bounce" />
            Preferences applied successfully.
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={handleSave}
          className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary/95 transition-all duration-150 active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
export default AppearanceSettings;
