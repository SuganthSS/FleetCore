import React from 'react';

interface FuelStatusBadgeProps {
  cost: number;
  quantity: number;
}

export const FuelStatusBadge: React.FC<FuelStatusBadgeProps> = ({ cost, quantity }) => {
  const pricePerGal = quantity > 0 ? cost / quantity : 0;
  
  let label = 'Standard Refuel';
  let badgeStyle = 'bg-blue-500/10 text-blue-600 border-blue-500/20';

  if (pricePerGal > 4.5) {
    label = 'Premium Rate';
    badgeStyle = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  } else if (quantity > 150) {
    label = 'Bulk Tank Refuel';
    badgeStyle = 'bg-purple-500/10 text-purple-600 border-purple-500/20';
  } else if (pricePerGal < 3.2) {
    label = 'Discount Rate';
    badgeStyle = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  }

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${badgeStyle}`}>
      {label}
    </span>
  );
};

export default FuelStatusBadge;
