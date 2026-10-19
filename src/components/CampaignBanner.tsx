// Latte Sale campaign banner for the home page. Prices come from the bundle
// products in src/data/products.ts, so the banner, cart and checkout always agree.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShoppingCart } from './icons';
import { useCart } from '../context/CartContextOptimized';
import { getProductById, type Product } from '../data/products';
import { analytics } from '../utils/analytics';
import { KineticHeading } from './kinetic';
import { Reveal } from './motion';

const OFFERS = [
  { id: 'latte-pack-2', label: 'Pack of 2', tubes: 2 },
  { id: 'latte-pack-6', label: 'Pack of 6', tubes: 6, bestValue: true },
];

const OfferCard: React.FC<{ product: Product; label: string; tubes: number; bestValue?: boolean }> = ({
  product,
  label,
  tubes,
  bestValue,
}) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const { id, name, price, originalPrice, image, weight } = product;
  const savings = originalPrice - price;

  const handleAdd = () => {
    addItem({ id, name, price, image, type: 'single', weight });
    analytics.addToCart({ id, name, price });
    setAdded(true);
  };

  return (
    <div
      className={`relative flex flex-col p-5 sm:p-6 ${
 bestValue ? 'bg-campaign-mint/10 border-2 border-campaign-mint' : 'bg-white/5 border border-white/15'
 }`}
    >
      {bestValue && (
        <span className="absolute -top-3 left-5 px-3 py-1 rounded bg-campaign-mint text-campaign-ink text-xs font-bold uppercase tracking-wide">
          Best value
        </span>
      )}
      <Link to={`/products/${id}`} className="text-sm font-medium text-white/70 hover:text-white">
        {label} · Latte
      </Link>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-heading text-4xl sm:text-5xl font-bold leading-none text-white">₹{price}</span>
        <span className="text-base text-white/60 line-through">₹{originalPrice}</span>
      </div>
      <p className="mt-1 text-sm text-white/70">
        ₹{Math.round(price / tubes)} per tube · <span className="font-semibold text-campaign-mint">Save ₹{savings}</span>
      </p>

      {added ? (
        <Link
          to="/cart"
          className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded bg-white text-campaign-ink font-heading font-bold"
        >
          <Check className="h-5 w-5" />
          Added · View cart
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          className={`mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded font-heading font-bold ${
 bestValue
 ? 'bg-campaign-mint text-campaign-ink'
 : 'bg-white/10 text-white hover:bg-white/20'
 }`}
          data-testid={`campaign-add-${id}`}
        >
          <ShoppingCart className="h-5 w-5" />
          Add {label.toLowerCase()}
        </button>
      )}
    </div>
  );
};

const CampaignBanner: React.FC = () => {
  const offers = OFFERS.flatMap((o) => {
    const product = getProductById(o.id);
    return product ? [{ ...o, product }] : [];
  });
  if (!offers.length) return null;

  return (
    <section aria-labelledby="latte-sale-heading" className="bg-background py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div
            data-campaign
            className="relative overflow-hidden bg-campaign-ink text-white grid lg:grid-cols-[1.1fr_1fr]"
          >
            {/* Photo: on top for phones, on the right for desktop */}
            <div className="relative h-64 sm:h-80 lg:h-auto lg:order-2 overflow-hidden">
              <img
                data-campaign-img
                src="/campaign/latte-sale-800.webp"
                srcSet="/campaign/latte-sale-800.webp 800w, /campaign/latte-sale-1200.webp 1200w"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 100vw, 92vw"
                alt="Cafe at Once Latte tubes and 6-pack boxes on roasted coffee beans"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-[50%_62%] lg:object-center scale-110"
              />
            </div>

            <div className="relative p-6 sm:p-10 lg:p-12 space-y-6">
              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.18em] text-campaign-mint">Latte sale / Limited time</p>

              <div className="space-y-3">
                <KineticHeading id="latte-sale-heading" className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase leading-[0.95]">
                  Stock up on <span className="text-campaign-mint">Latte.</span>
                </KineticHeading>
                <p className="text-base sm:text-lg text-white/75 max-w-md">
                  Real brewed Arabica latte, nitrogen-sealed in a press tube. The more you take, the less each cup costs.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 pt-2">
                {offers.map((o) => (
                  <OfferCard key={o.id} product={o.product} label={o.label} tubes={o.tubes} bestValue={o.bestValue} />
                ))}
              </div>

              <Link
                to="/latte"
                className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
              >
                See the Latte story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default CampaignBanner;
