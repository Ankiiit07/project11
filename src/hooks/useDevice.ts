import { useEffect, useMemo, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

const getDeviceFromWidth = (width: number): DeviceType => {
  if (width <= 768) return 'mobile';
  if (width <= 1024) return 'tablet';
  return 'desktop';
};

export function useDevice() {
  const [device, setDevice] = useState<DeviceType>(() => {
    if (typeof window === 'undefined') return 'desktop';
    return getDeviceFromWidth(window.innerWidth);
  });

  const isMobileUA = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor || (window as any)?.opera || '';
    return /android|iphone|ipad|ipod|windows phone/i.test(ua);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const update = () => setDevice(getDeviceFromWidth(window.innerWidth));

    // Listen for width changes
    const mediaQueries = [
      window.matchMedia('(max-width: 768px)'),
      window.matchMedia('(min-width: 769px) and (max-width: 1024px)'),
      window.matchMedia('(min-width: 1025px)')
    ];

    mediaQueries.forEach((mq) => mq.addEventListener?.('change', update));
    window.addEventListener('resize', update);
    update();

    return () => {
      mediaQueries.forEach((mq) => mq.removeEventListener?.('change', update));
      window.removeEventListener('resize', update);
    };
  }, []);

  const isMobile = device === 'mobile' || isMobileUA;
  const isTablet = device === 'tablet';
  const isDesktop = !isMobile && !isTablet;

  return { device, isMobile, isTablet, isDesktop };
} 