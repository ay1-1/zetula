import React from 'react';
import { ASSETS } from '../services/videoApi';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  onClick,
}) => {
  // Height and presentation based on size variant
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  };

  return (
    <div 
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
      onClick={onClick}
    >
      {/* Official authoritative Zetula logo asset */}
      <img
        src={ASSETS.logo}
        alt="Zetula AI Video Studio"
        className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
        loading="eager"
      />
    </div>
  );
};
