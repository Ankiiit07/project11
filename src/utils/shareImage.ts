// Link-preview images (WhatsApp, Instagram, Facebook, Google) look best at 1200×630.
// For Cloudinary photos, ask Cloudinary for that crop; other URLs pass through unchanged.
export const toShareImage = (url: string): string =>
  url.includes('res.cloudinary.com/') && url.includes('/image/upload/')
    ? url.replace('/image/upload/', '/image/upload/c_fill,g_auto,w_1200,h_630,q_auto,f_jpg/')
    : url;
