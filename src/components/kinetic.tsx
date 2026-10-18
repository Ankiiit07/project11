// Kinetic typography and the glitch effect, the two motion signatures of the site.
// - Glitch: the text splits into offset slices (coffee brown and bottle green) for ~0.5s.
// - KineticHeading: the headline stretches from condensed to full width as it scrolls in
//   (Bricolage Grotesque's width axis), then glitches once.
// - KineticMarquee: a band of huge words whose speed and direction follow your scrolling.
// Everything respects "reduce motion": text simply appears in its final state.
import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../lib/gsap';

const fireGlitch = (el: HTMLElement | null) => {
  if (!el || prefersReducedMotion()) return;
  el.classList.remove('is-glitching');
  void el.offsetWidth; // restart the animation
  el.classList.add('is-glitching');
  window.setTimeout(() => el.classList.remove('is-glitching'), 600);
};

interface GlitchProps {
  text: string;
  className?: string;
  /** Glitch once this many seconds after the page appears */
  onLoadAfter?: number;
  /** Keep glitching every 6 to 11 seconds while on screen */
  repeat?: boolean;
}

/** Inline text that glitches on load and, optionally, now and then afterwards. */
export const Glitch: React.FC<GlitchProps> = ({ text, className = '', onLoadAfter, repeat = false }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const timers: number[] = [];
    if (onLoadAfter !== undefined) timers.push(window.setTimeout(() => fireGlitch(el), onLoadAfter * 1000));
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    let next: number | undefined;
    const schedule = () => {
      next = window.setTimeout(() => {
        if (visible && !document.hidden) fireGlitch(el);
        schedule();
      }, 6000 + Math.random() * 5000);
    };
    if (repeat) schedule();
    return () => {
      timers.forEach(clearTimeout);
      if (next) clearTimeout(next);
      io.disconnect();
    };
  }, [onLoadAfter, repeat]);
  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className={`glitch ${className}`} data-text={text}>
        {text}
      </span>
    </>
  );
};

type HeadingTag = 'h1' | 'h2' | 'h3';

interface KineticHeadingProps {
  as?: HeadingTag;
  className?: string;
  children: React.ReactNode;
  /** Glitch once when the stretch finishes (default true) */
  glitch?: boolean;
  id?: string;
}

/** A section heading that widens from condensed to full width as it scrolls into view, then glitches once. */
export const KineticHeading: React.FC<KineticHeadingProps> = ({ as: Tag = 'h2', className = '', children, glitch = true, id }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      el.dataset.text = el.textContent || '';
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let done = false;
        gsap.fromTo(
          el,
          { '--wdth': 75, letterSpacing: '0.03em' },
          {
            '--wdth': 100,
            letterSpacing: '-0.02em',
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 92%',
              end: 'top 55%',
              scrub: 0.4,
              onLeave: () => {
                if (glitch && !done) {
                  done = true;
                  fireGlitch(el);
                }
              },
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
  return (
    <Tag
      ref={ref}
      id={id}
      className={`${glitch ? 'glitch ' : ''}${className}`}
      style={{ fontVariationSettings: "'wdth' var(--wdth, 100)", fontStretch: 'normal' }}
    >
      {children}
    </Tag>
  );
};

/** One huge word (or phrase) that widens from condensed to full width as it crosses the screen. */
export const KineticWord: React.FC<{ children: React.ReactNode; className?: string; as?: 'span' | 'h3' }> = ({
  children,
  className = '',
  as: Tag = 'span',
}) => {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { '--wdth': 75 },
          { '--wdth': 100, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top 90%', end: 'center 45%', scrub: 0.4 } }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={className}
      style={{ fontVariationSettings: "'wdth' var(--wdth, 100)", fontStretch: 'normal' }}
    >
      {children}
    </Tag>
  );
};

/** A band of huge repeating words. It drifts on its own; scrolling speeds it up and sets its direction. */
export const KineticMarquee: React.FC<{ items: string[]; className?: string }> = ({ items, className = '' }) => {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = track.current!;
        let x = 0;
        let dir = -1;
        let boost = 0;
        const st = ScrollTrigger.create({
          trigger: wrap.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            dir = self.direction === 1 ? -1 : 1;
            boost = Math.min(18, Math.abs(self.getVelocity()) / 120);
          },
        });
        const tick = (_t: number, dt: number) => {
          const half = el.scrollWidth / 2;
          if (!half) return;
          boost *= 0.92; // speed settles back after a flick
          x += dir * (1.1 + boost) * (dt / 16.667);
          if (x <= -half) x += half;
          if (x > 0) x -= half;
          gsap.set(el, { x });
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: wrap }
  );
  const row = items.map((item, i) => (
    <span key={i} className={`px-[0.25em] ${i % 2 ? 'type-outline' : ''}`}>
      {item}
      <span className="px-[0.25em] text-primary" aria-hidden="true">/</span>
    </span>
  ));
  return (
    <div ref={wrap} className={`overflow-hidden ${className}`} aria-label={items.join(', ')} role="img">
      <div ref={track} className="flex w-max whitespace-nowrap will-change-transform" aria-hidden="true">
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </div>
    </div>
  );
};
