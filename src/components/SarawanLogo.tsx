import React from 'react';

interface SarawanLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'full' | 'xl' | '2xl';
}

export const SarawanLogo: React.FC<SarawanLogoProps> = ({
  className = '',
  size = 'md',
  rounded = '2xl',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const roundedClasses = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  };

  return (
    <div
      className={`relative ${sizeClasses[size]} ${roundedClasses[rounded]} overflow-hidden shadow-md shadow-fuchsia-950/20 border border-stone-800/80 bg-stone-950 flex-shrink-0 flex items-center justify-center ${className}`}
    >
      <img
        src="/logo.jpg"
        alt="Sarawan Logo"
        className={`w-full h-full object-cover ${roundedClasses[rounded]}`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback if image path fails to load in some context
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
};
