import { Release } from "../app/release.js";
import { isValidBandcampURL } from "../bandcamp/html.js";
import { isArray, isFunction } from "./utils.js";

const storage = chrome.storage.local;

export function findAllReleasesInStorage(onFind) {
  storage.get(null, (data) => {
    console.log('storage.get', data);

    const releases = [];

    for (const key in data) {
      if (!isValidBandcampURL(key) || !data.hasOwnProperty(key)) {
        continue;
      }

      const releaseObject = data[key];

      if (releaseObject.release) {
        releases.push(releaseObject.release);
      }
    }

    if (isFunction(onFind)) onFind(releases);
  });
}

export function findReleaseInStorage(url, onFind, onMissing) {
  storage.get([url], (result) => {
    if (result[url] && result[url]['release']) {
      const release = createReleaseFromStorageItem(result[url]);
      if (isFunction(onFind)) onFind(release);
    } else {
      console.log("B2D: Release data doesn't exists", url);
      if (isFunction(onMissing)) onMissing(url);
    }
  });

}

export function findReleasesInStorage(urls, onFind) {
  storage.get(urls, result => {
    let releases = Object.values(result).map(item => createReleaseFromStorageItem(item));
    if (isFunction(onFind)) onFind(releases);
  });
}

export function findMissingKeysInStorage(keys, onFind) {
  storage.get(keys, result => {
    let foundKeys = Object.keys(result);
    let missingKeys = keys.filter(key => !foundKeys.includes(key));
    if (isFunction(onFind)) onFind(missingKeys);
  });
}

/**
 * @param {String} url
 * @param {Release} release
 */
export function saveRelease(url, release) {
  storage.set({ [url]: { release: release.toJSON() } }, () => {
    console.log("B2D: Release data was saved in the local storage");
  });
}

function createReleaseFromStorageItem(storageItem) {
  if (!storageItem.release) {
    throw new Error('Storage items is not Release object');
  }
  return Release.fromJSON(storageItem.release);
}

export function clearStorage() {
  storage.clear();
}

export function clearStorageByKey(key, onDone) {
  isArray(key)
    ? key.forEach(k => clearStorageByKey(k, onDone))
    : storage.remove(key, () => {
      if (chrome.runtime.lastError) {
        console.error(`Error clearing local storage item with key "${key}": ${chrome.runtime.lastError}`);
      }

      if (isFunction(onDone)) onDone();
    });
}
