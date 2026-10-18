// Adapted from React Bits (reactbits.dev) — ScrollFloat.
// Each character floats up and settles into place as the heading scrolls into
// view, tied to the scroll position. Works with nested markup
// (e.g. <span className="text-primary">), and GSAP keeps the full text
// readable to screen readers.
import React, { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../../lib/gsap';

interface ScrollFloatProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3';
  stagger?: number;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({ children, className = '', as: Tag = 'h2', stagger = 0.03 }) => {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(ref.current!, {
          type: 'words,chars',
          wordsClass: 'inline-block',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.chars,
              { opacity: 0, yPercent: 110, scaleY: 2.2, scaleX: 0.7, transformOrigin: '50% 0%' },
              {
                opacity: 1,
                yPercent: 0,
                scaleY: 1,
                scaleX: 1,
                ease: 'back.inOut(2)',
                stagger,
                scrollTrigger: { trigger: ref.current, start: 'top bottom-=5%', end: 'bottom center+=10%', scrub: true },
              }
            ),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
};

export default ScrollFloat;
