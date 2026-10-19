// Keep puppeteer's Chrome (used by scripts/prerender.mjs) inside node_modules,
// which Netlify caches between builds; its default home-folder cache is not kept.
const { join } = require('path');

module.exports = {
  cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer'),
};
