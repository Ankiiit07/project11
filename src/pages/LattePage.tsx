import React, { useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { useCart } from '../context/CartContextOptimized';
import { getProductById, products } from '../data/products';
import { analytics } from '../utils/analytics';
import { latteMarkup, type LatteOffer } from './latte/template';
import { initLattePage } from './latte/scene';
import './latte/latte.css';

const CANVAS = '#0C110F';

// The Latte story page: the green "Pour" design inside the shop, so its offers
// go straight into the real cart. The shop header and footer are hidden here (see App).
const LattePage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { addItem, state } = useCart();

  const html = useMemo(() => {
    const offers: LatteOffer[] = [
      { id: 'latte-pack-2', label: 'Pack of 2', tubes: 2 },
      { id: 'latte-pack-6', label: 'Pack of 6', tubes: 6, best: true },
    ].flatMap(({ id, ...rest }) => {
      const product = getProductById(id);
      return product ? [{ product, ...rest }] : [];
    });
    const others = products.filter((p) => !p.id.startsWith('latte') && p.inStock && !p.isPreOrder);
    return latteMarkup(offers, others);
  }, []);

  // Keep the latest cart action and router in a ref, so the page script is set up once
  const actions = useRef({ addItem, navigate });
  actions.current = { addItem, navigate };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return initLattePage(root, {
      onAdd: (id) => {
        const p = getProductById(id);
        if (!p) return;
        actions.current.addItem({ id: p.id, name: p.name, price: p.price, image: p.image, type: 'single', weight: p.weight });
        analytics.addToCart({ id: p.id, name: p.name, price: p.price, category: p.category });
      },
      onNavigate: (path) => actions.current.navigate(path),
    });
  }, [html]);

  // Cart count in the page's own nav
  const count = state.items.reduce((n, i) => n + i.quantity, 0);
  useEffect(() => {
    const el = rootRef.current?.querySelector<HTMLElement>('[data-cart-count]');
    if (!el) return;
    el.textContent = String(count);
    el.hidden = count === 0;
  }, [count, html]);

  // Dark page edges while this page is open, and no room kept for the hidden shop header
  useEffect(() => {
    const html = document.documentElement.style;
    const body = document.body.style;
    const prev = [html.background, body.background, body.paddingTop];
    html.background = CANVAS;
    body.background = CANVAS;
    body.paddingTop = '0';
    return () => {
      [html.background, body.background, body.paddingTop] = prev;
    };
  }, []);

  return (
    <>
      <SEO
        title="Cafe at Once Latte | Real coffee. In your pocket."
        description="Brewed Arabica latte in a press tube. One press into milk and it's ready in 5 seconds. No machine, no fridge, no sugar. Latte Sale: Pack of 6 for ₹600."
        url="https://cafeatonce.com/latte"
        image="https://cafeatonce.com/campaign/latte-sale-banner-1200x628.jpg"
      />
      <Helmet>
        <meta name="theme-color" content={CANVAS} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75,600;12..96,75,800&family=DM+Mono&display=swap"
        />
      </Helmet>
      <div ref={rootRef} className="lp" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
};

export default LattePage;
