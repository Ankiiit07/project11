// Same-day delivery in Bengaluru: one message, shown as a strip on the home page
// and as a notice on checkout (where it also confirms a Bengaluru PIN code).
import React from 'react';
import { Truck } from './icons';

export const SAME_DAY_MESSAGE = 'Same-day delivery now available in Bengaluru';

/** Bengaluru PIN codes run from 560001 to 560300 */
export const isBengaluruPincode = (pin: string) => {
  if (!/^\d{6}$/.test(pin)) return false;
  const n = Number(pin);
  return n >= 560001 && n <= 560300;
};

/** Full-width strip for the top of the home page */
export const SameDayStrip: React.FC = () => (
  <div className="bg-green-500 text-white" data-testid="same-day-strip">
    <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-center">
      <Truck className="h-4 w-4 shrink-0" />
      {SAME_DAY_MESSAGE}
    </p>
  </div>
);

/** Checkout notice; turns into a confirmation once a Bengaluru PIN code is entered */
export const SameDayNotice: React.FC<{ pincode?: string; className?: string }> = ({ pincode = '', className = '' }) => {
  const eligible = isBengaluruPincode(pincode);
  return (
    <div
      className={`flex items-start gap-3 border px-4 py-3 ${eligible ? 'border-green-500 bg-green-50' : 'border-foreground/20 bg-background'} ${className}`}
      role="status"
      data-testid="same-day-notice"
    >
      <Truck className="h-5 w-5 mt-0.5 shrink-0 text-green-500" />
      <div>
        <p className="font-heading font-bold uppercase tracking-wide text-foreground">
          {eligible ? 'Your order qualifies for same-day delivery' : SAME_DAY_MESSAGE}
        </p>
        <p className="text-sm text-foreground/70">
          {eligible ? 'Your PIN code is in Bengaluru, so we deliver today.' : 'Ordering to a Bengaluru address? It arrives the same day.'}
        </p>
      </div>
    </div>
  );
};
