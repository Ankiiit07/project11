import React, { useState } from 'react';
import { Calendar, MapPin, Truck } from 'lucide-react';
import { DEFAULT_SHIPPING_RATES, getDeliveryEstimate, getDeliveryZone, isValidPincode } from '../utils/shippingCalculator';

const PIN_KEY = 'cafe-at-once-pin';

const readPin = () => {
  try {
    return localStorage.getItem(PIN_KEY) || '';
  } catch {
    return '';
  }
};

/** "When will it arrive?" by PIN code, plus how far the shopper is from free shipping. */
const DeliveryCheck: React.FC<{ orderValue: number; preOrder?: boolean }> = ({ orderValue, preOrder }) => {
  const [pin, setPin] = useState(readPin);
  const valid = isValidPincode(pin);
  const zone = valid ? getDeliveryZone(pin) : null;
  const toFree = DEFAULT_SHIPPING_RATES.freeShippingThreshold - orderValue;

  const onChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setPin(digits);
    if (isValidPincode(digits)) {
      try {
        localStorage.setItem(PIN_KEY, digits);
      } catch {
        // remembering the PIN is only a convenience
      }
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3" data-testid="delivery-check">
      <label htmlFor="delivery-pin" className="flex items-center gap-2 text-sm font-medium text-foreground">
        <MapPin className="h-4 w-4 text-primary" /> Check delivery
      </label>
      <input
        id="delivery-pin"
        inputMode="numeric"
        autoComplete="postal-code"
        value={pin}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your 6-digit PIN code"
        className="w-full h-11 px-3 bg-background border border-border rounded-lg"
      />
      {pin.length === 6 && !valid && <p className="text-sm text-red-600">Please check the PIN code.</p>}
      {zone && (
        <div className="text-sm space-y-1">
          {preOrder ? (
            <p className="flex items-center gap-2 text-foreground/80">
              <Calendar className="h-4 w-4 text-primary" /> Pre-order: ships as soon as stock arrives
            </p>
          ) : (
            <p className="flex items-center gap-2 text-green-700 font-medium">
              <Calendar className="h-4 w-4" /> {getDeliveryEstimate(pin)}
            </p>
          )}
          {zone.expressAvailable && !preOrder && (
            <p className="text-foreground/70 pl-6">Express next-day delivery available (₹{zone.expressCharge})</p>
          )}
        </div>
      )}
      <p className="flex items-center gap-2 text-sm text-foreground/70">
        <Truck className="h-4 w-4 text-primary" />
        {toFree > 0 ? (
          <span>
            Add <strong className="text-foreground">₹{Math.ceil(toFree)}</strong> more for free shipping
          </span>
        ) : (
          <span className="text-green-700 font-medium">This order ships free</span>
        )}
      </p>
    </div>
  );
};

export default DeliveryCheck;
