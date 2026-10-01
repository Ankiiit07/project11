import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface StickyBuyBarProps {
  /** The page's own buy buttons; the bar shows only while they are off screen. */
  targetRef: React.RefObject<HTMLElement>;
  name: string;
  price: number;
  label: string;
  disabled?: boolean;
  onAdd: () => void;
}

const BAR_HEIGHT = '4.5rem';

/** Phone-only bar with the price and an add-to-cart button, so buying is always one tap away. */
const StickyBuyBar: React.FC<StickyBuyBarProps> = ({ targetRef, name, price, label, disabled, onAdd }) => {
  const [show, setShow] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    // Only once the visitor has scrolled past the buttons, not before reaching them.
    const io = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [targetRef]);

  // Lift floating buttons (Help) above the bar while it is showing.
  useEffect(() => {
    const root = document.documentElement;
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    root.style.setProperty('--bottom-bar', show && mobile ? BAR_HEIGHT : '0px');
    return () => root.style.setProperty('--bottom-bar', '0px');
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          data-testid="sticky-buy-bar"
        >
          <div className="flex items-center gap-3 px-4" style={{ height: BAR_HEIGHT }}>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-foreground/60 truncate">{name}</p>
              <p className="font-heading text-xl font-bold text-foreground">₹{price}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                onAdd();
                setAdded(true);
              }}
              disabled={disabled}
              aria-live="polite"
              className="h-12 px-6 bg-primary text-white font-heading font-bold rounded-full shadow-md active:scale-95 transition-transform disabled:bg-foreground/30 disabled:shadow-none"
            >
              {added ? 'Added ✓' : label}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBuyBar;
