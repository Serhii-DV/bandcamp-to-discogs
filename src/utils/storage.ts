import { log, logError } from './console';
import { isArray, isFunction } from './utils';

const storage = chrome.storage.local;

export type uuid = string;

export interface History extends Array<Date> {}

export interface HistoryData {
  [key: uuid]: History;
}

export interface VisitedDate {
  uuid: uuid;
  date: Date;
}

export function logStorageData() {
  storage.get(null).then((data) => log('Storage data', data));
}

/**
 * Clears all data from local storage.
 */
export function clearStorage(): void {
  storage.clear();
}

/**
 * Clears storage items by their keys and executes a callback when done.
 */
export function clearStorageByKey(
  key: string | string[],
  onDone?: () => void
): void {
  if (isArray(key)) {
    (key as string[]).forEach((k) => clearStorageByKey(k, onDone));
    return;
  }

  storage.remove(key, () => {
    if (chrome.runtime.lastError) {
      logError(
        `Error clearing local storage item with key "${key}": ${chrome.runtime.lastError.message}`
      );
    }
    if (onDone && isFunction(onDone)) {
      onDone();
    }
  });
}

/**
 * Retrieves the total number of bytes in use by the storage and invokes the callback with this value.
 */
export function getStorageSize(callback: (bytesInUse: number) => void) {
  if (typeof storage.getBytesInUse === 'function') {
    // Chrome supports getBytesInUse
    storage.getBytesInUse(null, callback);
  } else {
    // Fallback for Firefox
    storage.get(null, (items) => {
      const byteSize = Object.values(items).reduce((total, item) => {
        return (
          total +
          (typeof item === 'string' ? item.length : JSON.stringify(item).length)
        );
      }, 0);
      callback(byteSize);
    });
  }
}
