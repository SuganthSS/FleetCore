import React from 'react';
import type { AuditSeverity } from '@/types/audit';

interface SeverityBadgeProps {
  severity: AuditSeverity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const styles: Record<AuditSeverity, string> = {
    INFO: 'bg-blue-50 text-blue-700 border-blue-200',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200',
    HIGH: 'bg-orange-50 text-orange-800 border-orange-200',
    CRITICAL: 'bg-red-100 text-red-800 border-red-300 font-bold animate-pulse',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
        styles[severity] || styles.INFO
      }`}
    >
      {severity}
    </span>
  );
};
