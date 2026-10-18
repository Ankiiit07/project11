// After a new deploy, a tab (or a cached copy of the site) can still ask for page
// files from the old build, which no longer exist. Instead of showing an error,
// reload once so the browser picks up the new version.
import { lazy, type ComponentType } from 'react';

const KEY = 'cao-reloaded-for-new-version';
const CHUNK_ERROR =
  /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Expected a JavaScript.*module script|Unable to preload CSS/i;

export const isChunkLoadError = (error: unknown) =>
  CHUNK_ERROR.test(error instanceof Error ? `${error.name} ${error.message}` : String(error));

/** Reloads the page unless we already did so in the last 30 seconds. Returns true if reloading. */
export function reloadForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    return false; // no storage: don't risk a reload loop
  }
  window.location.reload();
  return true;
}

/** React.lazy that recovers from "file from an old deploy" errors by reloading once. */
export function lazyPage<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(() =>
    factory().catch((error) => {
      if (isChunkLoadError(error) && reloadForNewVersion()) return new Promise<{ default: T }>(() => {});
      throw error;
    })
  );
}

// Vite reports failed preloads of page files here too.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadForNewVersion()) event.preventDefault();
});
