import { products } from '../data/products';

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemap = (): SitemapUrl[] => {
  const baseUrl = 'https://tranquil-bonbon-7645e7.netlify.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const sitemap: SitemapUrl[] = [
    // Static pages
    {
      url: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9
    },
    {
      url: `${baseUrl}/about`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/contact`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    },
    {
      url: `${baseUrl}/insights`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/testimonials`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/return-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];

  // Add product pages
  products.forEach(product => {
    sitemap.push({
      url: `${baseUrl}/product/${product.id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  return sitemap;
};

export const generateSitemapXML = (): string => {
  const sitemap = generateSitemap();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map(url => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
}; 