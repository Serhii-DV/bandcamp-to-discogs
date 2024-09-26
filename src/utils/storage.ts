import { Release } from '../app/release.js';
import { log, logError } from './console';
import { generateKeyForUrl, generateKeysFromUrls } from './key-generator';
import {
  getArrLastElement,
  getOwnProperty,
  hasOwnProperty,
  isArray,
  isFunction,
  isObject
} from './utils';
import { validate as isUUID } from 'uuid';

const storage = chrome.storage.local;

interface StorageData {
  [key: string]: any;
}

interface History extends Array<string> {}

export interface HistoryData {
  [key: string]: History;
}

type ReleaseCallback = (release: Release) => void;
type ReleasesCallback = (releases: Release[]) => void;

export function logStorageData() {
  storage.get(null).then((data) => log('Storage data', data));
}

/**
 * Finds all releases from storage and release history and executes a callback function with the releases.
 */
export function findAllReleases(): Promise<Release[]> {
  return storage.get(null).then((storageData: StorageData) => {
    const releases: Release[] = [];

    for (const key in storageData) {
      if (
        !hasOwnProperty(storageData, key) ||
        !isObject(storageData[key]) ||
        !isUUID(key)
      ) {
        continue;
      }

      try {
        releases.push(Release.fromStorageObject(storageData[key]));
      } catch (error) {
        continue;
      }
    }

    return releases;
  });
}

/**
 * Finds a release by URL and executes the appropriate callback.
 * @param url - The URL to find the release for.
 * @param onFind - The callback function to call if the release is found.
 * @param onMissing - The callback function to call if the release is not found.
 */
export function findReleaseByUrl(
  url: string,
  onFind?: ReleaseCallback,
  onMissing?: (key: string) => void
): void {
  const key = generateKeyForUrl(url);

  storage.get([key], (result: StorageData) => {
    if (isObject(result[key])) {
      try {
        const release = Release.fromStorageObject(result[key]);
        if (onFind && isFunction(onFind)) {
          onFind(release);
        }
      } catch (error) {
        log('Broken storage data for release', result[key]);
        clearStorageByKey(key);
      }
    } else {
      log('Release data is missing', key);
      if (onMissing && isFunction(onMissing)) {
        onMissing(key);
      }
    }
  });
}

export function getReleaseByUuid(uuid: string): Promise<Release | undefined> {
  return storage.get([uuid]).then((storageData: StorageData) => {
    const releaseData = storageData[uuid];

    try {
      return Release.fromStorageObject(releaseData);
    } catch (error) {
      log('Broken storage data for release', releaseData);
      clearStorageByKey(uuid);
    }

    return undefined;
  });
}

export function getReleasesByUuids(uuids: string[]): Promise<Release[]> {
  return storage.get(uuids).then((storageData: StorageData) => {
    return getReleasesFromStorageData(storageData);
  });
}

const getReleasesFromStorageData = (storageData: StorageData) => {
  const releases: Release[] = Object.values(storageData)
    .map((obj: any) => {
      try {
        return Release.fromStorageObject(obj);
      } catch (error) {
        log('Broken storage object.', JSON.stringify(error), obj);
        return null;
      }
    })
    .filter((obj: Release | null): obj is Release => obj instanceof Release);

  return releases;
};

/**
 * Finds releases by their URLs and executes a callback with the found releases.
 */
export function findReleasesByUrls(
  urls: string[],
  onFind?: ReleasesCallback
): void {
  const keys = generateKeysFromUrls(urls);

  storage.get(keys, (result: StorageData) => {
    const releases: Release[] = Object.values(result)
      .map((obj: any) => {
        try {
          return Release.fromStorageObject(obj);
        } catch (error) {
          log('Broken storage object.', JSON.stringify(error), obj);
          return null;
        }
      })
      .filter((obj: Release | null): obj is Release => obj instanceof Release);

    if (onFind && isFunction(onFind)) {
      onFind(releases);
    }
  });
}

/**
 * Saves a Release object to local storage.
 */
export function saveRelease(release: Release): void {
  storage.set({ [release.uuid]: release.toStorageObject() }).then(() => {
    log('Release saved in the local storage', release.uuid);
    addReleaseHistory(release);
  });
}

export function addReleaseHistory(release: Release): void {
  const uuid = release.uuid;
  getHistoryByUuid(uuid).then((history) => {
    history.push(new Date().toISOString());
    setHistoryByUuid(uuid, history).then(() => {
      log('New history added to release', uuid);
    });
  });
}

export function getHistoryByUuid(uuid: string): Promise<History> {
  const key = generateHistoryKey(uuid);
  return storage.get([key]).then((result) => getOwnProperty(result, key, []));
}

export function setHistoryByUuid(
  uuid: string,
  history: History
): Promise<void> {
  const key = generateHistoryKey(uuid);
  return storage.set({ [key]: history });
}

export function getHistoryData(): Promise<HistoryData> {
  return storage.get(null).then((storageData: StorageData) => {
    const historyData: HistoryData = {};

    for (const key in storageData) {
      if (!key.startsWith(HISTORY_KEY_PREFIX)) continue;
      const uuid = key.slice(HISTORY_KEY_PREFIX.length);
      if (!isUUID(uuid)) continue;
      historyData[uuid] = storageData[key];
    }

    return historyData;
  });
}

export function getLatestHistoryData(
  limit: number
): Promise<Record<string, string>> {
  return getHistoryData().then((historyData) => {
    const releaseByLatestDate: Record<string, string> = {};

    for (const uuid in historyData) {
      releaseByLatestDate[uuid] = getArrLastElement(
        getOwnProperty(historyData, uuid, [])
      );
    }

    const sortedEntries = Object.entries(releaseByLatestDate).sort(
      ([, dateA], [, dateB]) => {
        // Convert the date strings to Date objects for comparison
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      }
    );

    const topEntries = sortedEntries.slice(0, limit);

    // Create a new object maintaining the original keys and their sorted values
    const sortedReleaseByLatestDate: Record<string, string> = {};
    for (const [key, value] of topEntries) {
      sortedReleaseByLatestDate[key] = value;
    }

    return sortedReleaseByLatestDate;
  });
}

const HISTORY_KEY_PREFIX = 'history.';
const generateHistoryKey = (uuid: string) => HISTORY_KEY_PREFIX + uuid;

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
