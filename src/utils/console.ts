import { getExtensionManifest } from './chrome';

// `update_url` field is not present in the manifest. If this field is absent, the extension is in development mode.
const isDevMode = !('update_url' in chrome.runtime.getManifest());

export const log = (...args: any[]): void => {
  if (!isDevMode) return;
  console.log(getLogPrefix('debug'), ...args);
};

export const logInfo = (...args: any[]): void => {
  if (!isDevMode) return;
  console.info(getLogPrefix('info'), ...args);
};

export const logError = (...args: any[]): void => {
  if (!isDevMode) return;
  console.error(getLogPrefix('error'), ...args);
};

const manifest = getExtensionManifest();

function getLogPrefix(level: string): string {
  return `[b2d][${manifest.version}][${level}]:`;
}
