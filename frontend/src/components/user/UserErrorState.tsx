import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface UserErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const UserErrorState: React.FC<UserErrorStateProps> = ({
  message = 'Failed to load enterprise users. Please verify network connectivity.',
  onRetry,
}) => {
  return (
    <div className="bg-white border border-[#ffdad6] rounded-2xl p-8 text-center shadow-xs space-y-4 font-['Inter']">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-[#ffdad6]/50 flex items-center justify-center text-[#ba1a1a]">
        <AlertCircle className="h-6 w-6" />
      </div>

      <div className="max-w-md mx-auto">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
          Error Loading Users
        </h3>
        <p className="text-xs text-[#ba1a1a] mt-1">{message}</p>
      </div>

      <div>
        <button
          onClick={onRetry}
          className="h-9 px-4 rounded-xl bg-[#004ac6] text-white text-xs font-semibold hover:bg-[#003ea8] transition-colors inline-flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry Request
        </button>
      </div>
    </div>
  );
};
