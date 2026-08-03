import React from 'react';

interface LicenseStatusBadgeProps {
  expiryDate: string;
}

export const LicenseStatusBadge: React.FC<LicenseStatusBadgeProps> = ({ expiryDate }) => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  let label = 'Valid';
  let badgeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20';

  if (daysUntilExpiry < 0) {
    label = 'Expired';
    badgeStyle = 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
  } else if (daysUntilExpiry <= 30) {
    label = `Expiring (${daysUntilExpiry}d)`;
    badgeStyle = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider ${badgeStyle}`}>
      {label}
    </span>
  );
};

export default LicenseStatusBadge;
