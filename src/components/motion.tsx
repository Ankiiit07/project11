// Small, calm animation building blocks for the home page. Every one of them
// respects the visitor's "reduce motion" setting: App wraps the site in
// <MotionConfig reducedMotion="user">, and CountUp checks it directly.
import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const; // soft ease-out

/** Fades a block up 20px the first time it scrolls into view. */
export const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children,
  className,
  delay = 0,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -60px 0px' }}
    transition={{ duration: 0.6, ease: EASE, delay }}
  >
    {children}
  </motion.div>
);

const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** A row or grid whose children appear one after another, 80ms apart. */
export const Stagger: React.FC<{ children: React.ReactNode; className?: string; as?: 'div' | 'ul' }> = ({
  children,
  className,
  as = 'div',
}) => {
  const Tag = as === 'ul' ? motion.ul : motion.div;
  return (
    <Tag
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </Tag>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string; as?: 'div' | 'li' }> = ({
  children,
  className,
  as = 'div',
}) => {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag className={className} variants={staggerChild}>
      {children}
    </Tag>
  );
};

/** Headline that appears word by word. Screen readers get the full sentence at once. */
export const WordReveal: React.FC<{ text: string; className?: string; delay?: number }> = ({ text, className, delay = 0 }) => (
  <span className={className}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">
      {text.split(' ').map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: '0.4em' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: delay + i * 0.08 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  </span>
);

/** Counts from 0 to `to` once, when first visible. Shows the final number straight away if motion is reduced. */
export const CountUp: React.FC<{ to: number; duration?: number; className?: string }> = ({ to, duration = 1.2, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) return setValue(to);
    const controls = animate(0, to, { duration, ease: 'easeOut', onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
};
