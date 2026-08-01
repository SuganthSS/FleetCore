import React from 'react';
import { Button } from '@/components/ui/button';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">FleetCore Infrastructure Initialized</h2>
      <p className="text-muted-foreground">
        Enterprise AI Fleet Management Foundation is ready.
      </p>
      <Button variant="primary">Platform System Active</Button>
    </div>
  );
};
