// Helpers for images hosted on Cloudinary (res.cloudinary.com). Cloudinary resizes
// and converts on the fly when transformation parameters follow /upload/.
// Non-Cloudinary URLs pass through unchanged.

const isCloudinary = (url: string, kind: 'image' | 'video' = 'image') =>
  url.includes('res.cloudinary.com/') && url.includes(`/${kind}/upload/`);

const transform = (url: string, params: string, kind: 'image' | 'video' = 'image') =>
  isCloudinary(url, kind) ? url.replace(`/${kind}/upload/`, `/${kind}/upload/${params}/`) : url;

/** A copy at most `width` px wide, in the best format the browser supports (WebP/AVIF). */
export const cld = (url: string, width: number): string => transform(url, `f_auto,q_auto,c_limit,w_${width}`);

/** srcSet for responsive <img>: phones download the small copy, desktops the large one. */
export const cldSrcSet = (url: string, widths: number[] = [320, 480, 640, 960]): string | undefined =>
  isCloudinary(url) ? widths.map((w) => `${cld(url, w)} ${w}w`).join(', ') : undefined;

/** A lighter copy of a Cloudinary video, and a still frame to show before it plays. */
export const cldVideo = (url: string, width: number): string => transform(url, `q_auto,c_limit,w_${width}`, 'video');
export const cldVideoPoster = (url: string, width: number): string =>
  isCloudinary(url, 'video')
    ? transform(url, `so_1,f_auto,q_auto,c_limit,w_${width}`, 'video').replace(/\.[a-z0-9]+$/i, '.jpg')
    : '';

// Link-preview images (WhatsApp, Instagram, Facebook, Google) look best at 1200×630.
export const toShareImage = (url: string): string => transform(url, 'c_fill,g_auto,w_1200,h_630,q_auto,f_jpg');
