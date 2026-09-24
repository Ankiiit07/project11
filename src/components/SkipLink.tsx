import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Skip to navigation
      </a>
      <a
        href="#footer"
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Skip to footer
      </a>
    </>
  );
};

export default SkipLink; 