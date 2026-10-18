import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  variant?: 'default' | 'white';
  compact?: boolean;
}

// A typographic wordmark: no icon, no effects
const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '', variant = 'default' }) => {
  const sizeClasses = { small: 'text-base', medium: 'text-xl', large: 'text-3xl' };
  const colorClass = variant === 'white' ? 'text-white' : 'text-foreground';
  return (
    <span className={`font-heading font-extrabold uppercase tracking-tight leading-none [font-stretch:75%] ${sizeClasses[size]} ${colorClass} ${className}`}>
      Cafe at Once
    </span>
  );
};

export default Logo;
