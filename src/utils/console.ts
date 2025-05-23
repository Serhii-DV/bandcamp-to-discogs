import { getExtensionManifest } from './chrome';

// `update_url` field is not present in the manifest. If this field is absent, the extension is in development mode.
const manifest = getExtensionManifest();
const isDevMode = !('update_url' in manifest);

export const log = (...args: any[]): void => {
  if (!isDevMode) return;
  console.log(getLogPrefix('log'), ...args);
};

export const debug = (...args: any[]): void => {
  if (!isDevMode) return;
  console.debug(getLogPrefix('debug'), ...args);
};

export const logInfo = (...args: any[]): void => {
  if (!isDevMode) return;
  console.info(getLogPrefix('info'), ...args);
};

export const logError = (...args: any[]): void => {
  if (!isDevMode) return;
  console.error(getLogPrefix('error'), ...args);
};

function getLogPrefix(level: string): string {
  return `[b2d][${manifest.version}][${level}]:`;
}
