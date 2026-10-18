// Adapted from React Bits (reactbits.dev) — Magnet.
// Gently pulls its child toward the cursor when it comes near. Mouse only;
// does nothing on touch screens or with reduced motion.
import React, { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../../lib/gsap';

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  /** Extra px around the element where the pull starts */
  padding?: number;
  /** Higher = weaker pull */
  strength?: number;
}

const Magnet: React.FC<MagnetProps> = ({ children, className = '', padding = 60, strength = 4 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const dx = e.clientX - (left + width / 2);
      const dy = e.clientY - (top + height / 2);
      const near = Math.abs(dx) < width / 2 + padding && Math.abs(dy) < height / 2 + padding;
      xTo(near ? dx / strength : 0);
      yTo(near ? dy / strength : 0);
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [padding, strength]);

  return (
    <div ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default Magnet;
