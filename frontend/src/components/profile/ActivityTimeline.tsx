import React from 'react';
import { Clock, ShieldCheck, Laptop } from 'lucide-react';
import { UserProfileData } from '@/services/profile.service';

export const ActivityTimeline: React.FC<{ profile: UserProfileData }> = ({ profile }) => {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <Clock className="h-5 w-5" />
        </div>
        <h2 className="text-base font-bold text-foreground">Recent Activity & Audit Log</h2>
      </div>

      <div className="space-y-3 text-xs">
        {profile.recentActivity.map((act) => (
          <div key={act.id} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-bold text-foreground block">{act.action}</span>
                {act.ipAddress && (
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Laptop className="h-3 w-3" /> IP: {act.ipAddress}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[11px] font-semibold text-muted-foreground">{act.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
