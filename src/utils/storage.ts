import { Release } from "../app/release.js";
import { log, logError } from "./console";
import { generateKeyForRelease, generateKeyForUrl, generateKeysFromUrls } from "./key-generator";
import { hasOwnProperty, isArray, isFunction, isObject } from "./utils";

const storage = chrome.storage.local;

interface StorageData {
  [key: string]: any;
}

type ReleaseCallback = (release: Release) => void;
type ReleasesCallback = (releases: Release[]) => void;

export function logStorage() {
  log('Storage data');
  storage.get(null, (data) => console.log(data));
}

/**
 * Finds all releases from storage and executes a callback function with the releases.
 * @param onFind - The callback function to call with the found releases.
 */
export function findAllReleases(onFind?: ReleasesCallback): void {
  storage.get(null, (data: StorageData) => {
    const releases: Release[] = [];

    for (const key in data) {
      if (!hasOwnProperty(data, key) || !isObject(data[key])) {
        continue;
      }

      try {
        releases.push(Release.fromStorageObject(data[key]));
      } catch (error) {
        continue;
      }
    }

    if (onFind && isFunction(onFind)) {
      onFind(releases);
    }
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
        log("Broken storage data for release", result[key]);
        clearStorageByKey(key);
      }
    } else {
      log("Release data is missing", key);
      if (onMissing && isFunction(onMissing)) {
        onMissing(key);
      }
    }
  });
}

/**
 * Finds releases by their URLs and executes a callback with the found releases.
 */
export function findReleasesByUrls(urls: string[], onFind?: ReleasesCallback): void {
  const keys = generateKeysFromUrls(urls);

  storage.get(keys, (result: StorageData) => {
    const releases: Release[] = Object
      .values(result)
      .map((obj: any) => {
        try {
          return Release.fromStorageObject(obj);
        } catch (error) {
          log("Broken storage object.", JSON.stringify(error), obj);
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
  const key = generateKeyForRelease(release);
  storage.set({ [key]: release.toStorageObject() }, () => {
    log("Release data was saved in the local storage");
  });
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
export function clearStorageByKey(key: string | string[], onDone?: (() => void)): void {
  if (isArray(key)) {
    (key as string[]).forEach(k => clearStorageByKey(k, onDone));
    return;
  }

  storage.remove(key, () => {
    if (chrome.runtime.lastError) {
      logError(`Error clearing local storage item with key "${key}": ${chrome.runtime.lastError.message}`)
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
  storage.getBytesInUse(null, callback);
}
