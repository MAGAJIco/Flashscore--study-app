// src/utils/offlineUtils.ts
export const isClient = typeof window !== "undefined";

/**
 * Attach online/offline event listeners.
 * Returns a cleanup function to remove them.
 */
export function registerNetworkEvents(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (!isClient) return () => {};

  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}