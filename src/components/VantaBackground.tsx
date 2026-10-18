// Animated Vanta.js background (soft coffee-coloured fog). three.js and Vanta
// are ~150KB gzipped, so they load only on larger screens with a mouse, only
// when motion is allowed, and only after the page has painted. Everyone else
// keeps the static `fallback`.
import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/gsap';

interface VantaBackgroundProps {
  className?: string;
  fallback?: React.ReactNode;
}

type VantaEffect = { destroy: () => void };

const canRunVanta = () =>
  typeof window !== 'undefined' &&
  !prefersReducedMotion() &&
  window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;

const VantaBackground: React.FC<VantaBackgroundProps> = ({ className = '', fallback = null }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canRunVanta()) return;
    let effect: VantaEffect | null = null;
    let cancelled = false;

    const start = async () => {
      const [THREE, { default: FOG }] = await Promise.all([import('three'), import('vanta/dist/vanta.fog.min')]);
      if (cancelled || !ref.current) return;
      effect = FOG({
        el: ref.current,
        THREE,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        highlightColor: 0xf0e4d3, // cream
        midtoneColor: 0xd4c5b0, // latte
        lowlightColor: 0xb89a7a, // light roast
        baseColor: 0xf5f1eb, // page background
        blurFactor: 0.7,
        speed: 1.2,
        zoom: 0.8,
      });
      setReady(true);
    };

    // Wait until the browser is idle so the hero paints first
    const run = () => void start().catch(() => {});
    const hasIdle = 'requestIdleCallback' in window;
    const handle = hasIdle ? window.requestIdleCallback(run) : window.setTimeout(run, 200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      effect?.destroy();
    };
  }, []);

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {!ready && fallback}
      <div ref={ref} className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default VantaBackground;
