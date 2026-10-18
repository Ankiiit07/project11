// Latte Sale campaign banner for the home page. Prices come from the bundle
// products in src/data/products.ts, so the banner, cart and checkout always agree.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContextOptimized';
import { getProductById, type Product } from '../data/products';
import { analytics } from '../utils/analytics';
import ShinyText from './reactbits/ShinyText';
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
      className={`relative flex flex-col rounded-2xl p-5 sm:p-6 backdrop-blur-sm ${
        bestValue ? 'bg-campaign-mint/10 border-2 border-campaign-mint' : 'bg-white/5 border border-white/15'
      }`}
    >
      {bestValue && (
        <span className="absolute -top-3 left-5 px-3 py-1 rounded-full bg-campaign-mint text-campaign-ink text-xs font-bold uppercase tracking-wide">
          Best value
        </span>
      )}
      <Link to={`/products/${id}`} className="text-sm font-medium text-white/70 hover:text-white">
        {label} · Latte
      </Link>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-heading text-4xl sm:text-5xl font-bold leading-none text-white">₹{price}</span>
        <span className="text-base text-white/40 line-through">₹{originalPrice}</span>
      </div>
      <p className="mt-1 text-sm text-white/70">
        ₹{Math.round(price / tubes)} per tube · <span className="font-semibold text-campaign-mint">Save ₹{savings}</span>
      </p>

      {added ? (
        <Link
          to="/cart"
          className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-campaign-ink font-heading font-bold"
        >
          <Check className="h-5 w-5 text-green-600" />
          Added · View cart
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleAdd}
          className={`mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-heading font-bold transition-all duration-300 hover:-translate-y-0.5 ${
            bestValue
              ? 'bg-campaign-mint text-campaign-ink hover:shadow-[0_8px_30px_rgba(111,211,168,0.35)]'
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
    <section aria-labelledby="latte-sale-heading" className="bg-white py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div
            data-campaign
            className="relative overflow-hidden rounded-3xl bg-campaign-ink text-white grid lg:grid-cols-[1.1fr_1fr] shadow-2xl"
          >
            {/* Soft green glow taken from the packaging */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(60% 80% at 15% 20%, rgba(31,107,84,0.55), transparent 70%), radial-gradient(50% 60% at 90% 100%, rgba(111,211,168,0.18), transparent 70%)',
              }}
            />

            {/* Photo: on top for phones, on the right for desktop */}
            <div className="relative h-64 sm:h-80 lg:h-auto lg:order-2 overflow-hidden">
              <img
                data-campaign-img
                src="/campaign/latte-sale-800.webp"
                srcSet="/campaign/latte-sale-800.webp 800w, /campaign/latte-sale-1200.webp 1200w"
                sizes="(min-width: 1024px) 45vw, 100vw"
                alt="Cafe at Once Latte tubes and 6-pack boxes on roasted coffee beans"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-[50%_62%] lg:object-center scale-110"
              />
              {/* Fades the photo into the text side */}
              <div className="absolute inset-0 bg-gradient-to-t from-campaign-ink via-transparent to-transparent lg:bg-gradient-to-r lg:from-campaign-ink lg:via-campaign-ink/10" aria-hidden="true" />
            </div>

            <div className="relative p-6 sm:p-10 lg:p-12 space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-campaign-mint/15 border border-campaign-mint/40 text-campaign-mint">
                <Tag className="h-4 w-4" />
                <ShinyText text="Latte Sale · Limited time" className="text-xs sm:text-sm font-semibold" />
              </span>

              <div className="space-y-3">
                <h2 id="latte-sale-heading" className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]">
                  Stock up on <span className="text-campaign-mint">Latte.</span>
                </h2>
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
                to="/products/latte-concentrate"
                className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
              >
                What's in a Latte tube?
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
