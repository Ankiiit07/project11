import React from 'react';
import { Coffee } from 'lucide-react';
import SteamEffect from './SteamEffect';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: 'default' | 'white';
  compact?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '', variant = 'default', compact = false }) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl'
  };

  const colorClass = variant === 'white' ? 'text-white' : 'text-[#8B7355]';

  return (
    <div className={`flex items-center space-x-2 font-bold ${sizeClasses[size]} ${colorClass} ${className}`}>
      <div className="relative">
        <Coffee className="h-6 w-6" />
        {/* Steam effect for the coffee icon */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <SteamEffect 
            intensity="light" 
            size="small"
            color="rgba(139, 115, 85, 0.6)"
          />
        </div>
      </div>
      {compact ? (
        <span>Cafe at Once</span>
      ) : (
        <span>Cafe at Once</span>
      )}
    </div>
  );
};

export default Logo; 