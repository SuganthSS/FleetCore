import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface DashboardErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const DashboardErrorState: React.FC<DashboardErrorStateProps> = ({
  title = 'Failed to Load Executive Dashboard',
  description = 'An error occurred while communicating with the FleetCore backend service. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="bg-white border border-[#ffdad6] rounded-2xl p-12 text-center shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] max-w-2xl mx-auto my-10 relative overflow-hidden">
      <div className="bg-[#ffdad6] text-[#ba1a1a] p-4 rounded-2xl w-16 h-16 mx-auto flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30] mb-2">
        {title}
      </h3>
      <p className="font-['Inter'] text-sm text-[#434655] max-w-md mx-auto mb-6">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-[#ba1a1a] text-white font-['Inter'] text-xs font-semibold px-5 py-2.5 rounded-lg hover:bg-[#93000a] transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
