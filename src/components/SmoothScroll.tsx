// Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger animations
// stay perfectly in step with the page. Skipped when the visitor asks for
// reduced motion. Inner scroll areas opt out with `data-lenis-prevent`.
import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap';

const LenisContext = createContext<Lenis | null>(null);

/** The running Lenis instance, or null when smooth scrolling is off. */
export const useLenis = () => useContext(LenisContext);

const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -80 }, // in-page links (#how-it-works) clear the sticky header
    });

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
};

export default SmoothScroll;
