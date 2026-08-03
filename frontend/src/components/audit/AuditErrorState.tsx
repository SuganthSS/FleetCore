import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AuditErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export const AuditErrorState: React.FC<AuditErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4 font-['Inter']">
      <div className="mx-auto w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-red-900">
          Failed to Load Audit Logs
        </h3>
        <p className="text-xs text-red-700 max-w-md mx-auto">
          {message || 'An error occurred while communicating with the audit service.'}
        </p>
      </div>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 h-9 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors shadow-xs"
      >
        <RefreshCw className="h-3.5 w-3.5" /> Retry Request
      </button>
    </div>
  );
};
