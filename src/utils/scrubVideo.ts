// Helpers for a video driven by scroll position.
// - The file is fetched whole and played from a blob URL, so seeking works even
//   where the host doesn't support partial downloads.
// - Seeks are gated: a new seek waits for the previous one to finish (only the
//   newest target is kept), which is what keeps scrubbing smooth in Chrome.

/** The MP4 (H.264) where the browser plays it, otherwise the WebM (VP9) copy. `base` has no extension. */
export const pickVideoSource = (video: HTMLVideoElement, base: string) =>
  video.canPlayType('video/mp4; codecs="avc1.42E01E"') ? `${base}.mp4` : `${base}.webm`;

/** Loads `url` into `video` as a blob. Resolves when the first frame can be shown. */
export async function loadVideoBlob(video: HTMLVideoElement, url: string, signal?: AbortSignal): Promise<void> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Video request failed (${res.status})`);
  const blobUrl = URL.createObjectURL(await res.blob());
  signal?.addEventListener('abort', () => URL.revokeObjectURL(blobUrl), { once: true });
  video.src = blobUrl;
  video.load();
  await new Promise<void>((resolve, reject) => {
    video.addEventListener('loadeddata', () => resolve(), { once: true });
    video.addEventListener('error', () => reject(new Error('Video could not be decoded')), { once: true });
  });
}

/** Returns seek(progress 0..1) for `video`, with overlapping seeks coalesced. */
export function createSeeker(video: HTMLVideoElement): (progress: number) => void {
  let busy = false;
  let pending: number | null = null;
  const go = (t: number) => {
    busy = true;
    video.currentTime = t;
  };
  video.addEventListener('seeked', () => {
    busy = false;
    if (pending !== null) {
      const t = pending;
      pending = null;
      go(t);
    }
  });
  // never let a failed seek block the next one
  video.addEventListener('error', () => {
    busy = false;
    pending = null;
  });
  return (progress: number) => {
    if (!video.duration) return;
    // stop a hair before the end so the last frame stays on screen
    const t = Math.min(video.duration - 0.04, Math.max(0, progress * video.duration));
    if (busy) pending = t;
    else go(t);
  };
}
