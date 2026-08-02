import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-8xl font-extrabold tracking-tight text-primary">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        <HomeIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
};
