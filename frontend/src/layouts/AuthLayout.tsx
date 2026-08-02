import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 px-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
