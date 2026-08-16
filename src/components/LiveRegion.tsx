import React, { useEffect, useRef } from 'react';

interface LiveRegionProps {
  message: string;
  type?: 'polite' | 'assertive';
  'aria-live'?: 'polite' | 'assertive' | 'off';
  className?: string;
}

const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  type = 'polite',
  'aria-live': ariaLive = 'polite',
  className = 'sr-only'
}) => {
  const regionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && regionRef.current) {
      // Clear the region first
      regionRef.current.textContent = '';
      
      // Use setTimeout to ensure the clear is processed before the new message
      setTimeout(() => {
        if (regionRef.current) {
          regionRef.current.textContent = message;
        }
      }, 100);
    }
  }, [message]);

  return (
    <div
      ref={regionRef}
      aria-live={ariaLive}
      aria-atomic="true"
      className={className}
      role="status"
      aria-label={`${type} announcement`}
    />
  );
};

export default LiveRegion; 