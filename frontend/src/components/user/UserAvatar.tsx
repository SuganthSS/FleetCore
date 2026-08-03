import React from 'react';

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  lastName,
  size = 'md',
  className = '',
}) => {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
  }[size];

  // Hash initial to generate a consistent subtle gradient background
  const colors = [
    'from-blue-600 to-indigo-600',
    'from-emerald-600 to-teal-600',
    'from-purple-600 to-indigo-600',
    'from-amber-600 to-orange-600',
    'from-rose-600 to-pink-600',
  ];
  const colorIndex = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br ${colors[colorIndex]} font-['Plus_Jakarta_Sans'] font-extrabold text-white shadow-xs ${sizeClasses} ${className}`}
    >
      {initials}
    </div>
  );
};
