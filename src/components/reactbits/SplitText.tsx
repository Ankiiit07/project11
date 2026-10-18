// Adapted from React Bits (reactbits.dev) — SplitText.
// Splits text into characters/words with GSAP SplitText and animates them in
// when scrolled into view. GSAP adds aria-label/aria-hidden so screen readers
// still read the whole sentence.
import React, { useRef } from 'react';
import { gsap, SplitText as GSAPSplitText, useGSAP } from '../../lib/gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  /** Seconds between each piece */
  stagger?: number;
  /** Seconds before the first piece starts */
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  stagger = 0.03,
  delay = 0,
  duration = 0.8,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag: Tag = 'span',
}) => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // autoSplit re-splits (and restarts the tween) once web fonts load or the width changes
        const split = GSAPSplitText.create(ref.current!, {
          type: splitType === 'chars' ? 'words,chars' : 'words',
          wordsClass: 'inline-block',
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(splitType === 'chars' ? self.chars : self.words, from, {
              ...to,
              duration,
              ease,
              delay,
              stagger,
              scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
            }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { dependencies: [text], scope: ref }
  );

  return (
    <Tag ref={ref as React.Ref<never>} className={`inline-block ${className}`}>
      {text}
    </Tag>
  );
};

export default SplitText;
