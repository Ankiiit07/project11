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
    <div className={`animate-spin rounded border-2 border-gray-200 ${color} ${sizeClasses[size]} ${className}`} />
  );
});

OptimizedLoader.displayName = 'OptimizedLoader';

// Page loader component
// Page skeleton: the outline of a page (heading, text lines, a row of product tiles)
// so the layout does not jump when the real page arrives
export const PageLoader: React.FC = () => (
  <div className="min-h-screen pt-28 pb-16" role="status" aria-label="Loading page">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="skeleton h-3 w-32" />
      <div className="skeleton h-12 sm:h-16 w-3/4 max-w-2xl" />
      <div className="space-y-3 max-w-xl">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="skeleton aspect-square w-full" />
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
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