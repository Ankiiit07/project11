// Entry point, kept tiny on purpose. Public pages arrive pre-rendered (scripts/prerender.mjs),
// so the browser can paint them right away; the app (React, animation libraries) loads
// after that first paint instead of holding it back. Pages without pre-rendered HTML
// (cart, checkout, account) start the app immediately.
import './index.css';

const start = () => import('./bootstrap');

if (document.getElementById('root')?.hasChildNodes()) {
  // requestAnimationFrame runs just before the next paint; the timeout lands just after it
  requestAnimationFrame(() => setTimeout(start, 0));
} else {
  start();
}
