import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Outlet />
    </div>
  );
};
