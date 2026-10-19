import { products } from '../data/products';
import { SITE_URL } from './sitemapGenerator';

// Used at build time (vite.config.ts) to write dist/llms.txt: a plain-text guide to the
// shop for AI assistants (ChatGPT, Claude, Gemini, Perplexity...), following llmstxt.org.
// Products and prices come from the catalogue, so it never goes stale.

const productLine = (p: (typeof products)[number]) => {
  const status = p.isPreOrder ? ' (pre-order)' : p.inStock ? '' : ' (out of stock)';
  const summary = p.description.trim().split('. ')[0].replace(/\.$/, '');
  return `- [${p.name}](${SITE_URL}/products/${encodeURIComponent(p.id)}): ₹${p.price}${status}. ${summary}.`;
};

export const generateLlmsTxt = (): string => {
  const available = products.filter((p) => !p.isPreOrder);
  const preorders = products.filter((p) => p.isPreOrder);
  return `# Cafe at Once

> Cafe at Once makes nitrogen-preserved brewed Arabica coffee in a portable press tube, based in Mumbai, India. Squeeze a tube into water or milk, hot or cold, and it is ready in about 5 seconds: no machine, no fridge, no sugar or additives. Tubes keep for 12 months without refrigeration and are small enough for cabin baggage.

## Key facts

- Ships across India; free shipping on orders above ₹1000.
- Same-day delivery in Bengaluru.
- Contact: cafeatonce@gmail.com, +91 7979837079.

## Products

${available.map(productLine).join('\n')}

## Pre-order

${preorders.map(productLine).join('\n')}

## Learn more

- [How it works and FAQ](${SITE_URL}/faq)
- [What is nitrogen-preserved coffee?](${SITE_URL}/blog/what-is-nitrogen-preserved-coffee)
- [Instant vs brewed coffee](${SITE_URL}/blog/instant-vs-brewed-coffee-difference)
- [How to make coffee without a machine](${SITE_URL}/blog/how-to-make-coffee-without-machine)
- [Best portable coffee for travellers in India](${SITE_URL}/blog/best-portable-coffee-travellers-india)
- [Why Arabica coffee matters](${SITE_URL}/blog/why-arabica-coffee-matters)
- [Customer reviews](${SITE_URL}/testimonials)
- [About Cafe at Once](${SITE_URL}/about)

## Policies

- [Shipping policy](${SITE_URL}/shipping-policy)
- [Return policy](${SITE_URL}/return-policy)
- [Terms and conditions](${SITE_URL}/terms-conditions)
- [Privacy policy](${SITE_URL}/privacy-policy)
`;
};
