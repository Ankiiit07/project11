import React, { memo } from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

// Optimized loading spinner component
const OptimizedLoader: React.FC<LoaderProps> = memo(({ 
  size = 'md', 
  color = 'border-primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 ${color} ${sizeClasses[size]} ${className}`} />
  );
});

OptimizedLoader.displayName = 'OptimizedLoader';

// Page loader component
export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <OptimizedLoader size="lg" />
  </div>
);

// Inline loader component
export const InlineLoader: React.FC<{ className?: string }> = ({ className }) => (
  <OptimizedLoader size="sm" className={className} />
);

// Button loader component
export const ButtonLoader: React.FC = () => (
  <OptimizedLoader size="sm" color="border-white" />
);

export default OptimizedLoader; 