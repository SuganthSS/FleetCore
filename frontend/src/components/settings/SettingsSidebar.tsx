import React from 'react';
import {
  Building2,
  Sliders,
  Palette,
  Bell,
  ShieldCheck,
  Cpu,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SettingsTab } from '@/types/settings';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const sections: { id: SettingsTab; name: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'profile', name: 'Company Profile', icon: Building2 },
    { id: 'general', name: 'General Settings', icon: Sliders },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security & API Keys', icon: ShieldCheck },
    { id: 'integrations', name: 'Integrations & Services', icon: Cpu },
    { id: 'ai', name: 'Groq AI Settings', icon: Sparkles, badge: 'Groq LPU' },
  ];

  return (
    <div className="flex flex-col gap-1 w-full lg:w-64 shrink-0 rounded-xl border border-border bg-card p-3 shadow-xs text-left">
      <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        Organization Configuration
      </div>
      {sections.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeTab === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => onTabChange(sec.id)}
            className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <span className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0" />
              <span>{sec.name}</span>
            </span>
            {sec.badge && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase',
                  isActive
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-primary/10 text-primary border border-primary/20'
                )}
              >
                {sec.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
export default SettingsSidebar;
