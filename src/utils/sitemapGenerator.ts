import { products } from '../data/products';

// Used at build time (vite.config.ts) to write dist/sitemap.xml for search engines.

export const SITE_URL = 'https://cafeatonce.com';

// Public pages worth indexing. Account, cart, checkout, orders and admin pages are left out.
const STATIC_PATHS = [
  '/',
  '/products',
  '/insights',
  '/about',
  '/contact',
  '/testimonials',
  '/faq',
  '/customer-service',
  '/shipping-policy',
  '/return-policy',
  '/terms-conditions',
  '/privacy-policy',
];

const BLOG_PATHS = [
  '/blog/what-is-nitrogen-preserved-coffee',
  '/blog/best-portable-coffee-travellers-india',
  '/blog/instant-vs-brewed-coffee-difference',
  '/blog/how-to-make-coffee-without-machine',
  '/blog/why-arabica-coffee-matters',
];

export interface SitemapUrl {
  url: string;
  images?: string[];
}

export const generateSitemap = (): SitemapUrl[] => [
  ...STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}` })),
  ...BLOG_PATHS.map((path) => ({ url: `${SITE_URL}${path}` })),
  ...products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    images: [...new Set([product.image, ...(product.images || [])])].filter(Boolean),
  })),
];

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const generateSitemapXML = (): string => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${generateSitemap()
  .map(
    ({ url, images = [] }) =>
      `  <url>\n    <loc>${escapeXml(url)}</loc>\n${images
        .map((img) => `    <image:image><image:loc>${escapeXml(img)}</image:loc></image:image>\n`)
        .join('')}  </url>`
  )
  .join('\n')}
</urlset>
`;
