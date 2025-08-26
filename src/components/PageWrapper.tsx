import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  className = '', 
  fullHeight = false,
  padding = 'medium' 
}) => {
  const paddingClasses = {
    none: '',
    small: 'px-4 sm:px-6 lg:px-8',
    medium: 'px-4 sm:px-6 lg:px-8 py-8',
    large: 'px-4 sm:px-6 lg:px-8 py-12'
  };

  const heightClass = fullHeight ? 'min-h-screen' : '';

  return (
    <div className={`w-full ${heightClass} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default PageWrapper;
