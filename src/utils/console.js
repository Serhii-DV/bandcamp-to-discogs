// `update_url` field is not present in the manifest. If this field is absent, the extension is in development mode.
const isDevMode = !('update_url' in chrome.runtime.getManifest());

export const logInfo = (...args) => {
  if (!isDevMode) return;
  const timestamp = new Date().toISOString();
  console.log(`[B2D][INFO] ${timestamp}:`, ...args);
}

export const logError = (...args) => {
  if (!isDevMode) return;
  const timestamp = new Date().toISOString();
  console.error(`[B2D][ERROR] ${timestamp}:`, ...args);
}
