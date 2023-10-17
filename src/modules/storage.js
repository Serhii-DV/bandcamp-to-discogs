import { Release } from "../app/release.js";
import { isValidBandcampURL } from "../bandcamp/html.js";
import { isArray, isFunction, isObject } from "./utils.js";

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
 * @param {String} key
 * @param {Release} release
 */
export function saveRelease(key, release) {
  storage.set({ [key]: { release: release.toJSON() } }, () => {
    console.log("B2D: Release data was saved in the local storage");
  });
}

/**
 * @param {String} key
 * @param {Array} categoryValues
 */
export function addReleaseHistory(key, categoryValues) {
  storage.get([key], (data) => {
    let releaseData = data[key] || null;
    if (releaseData === null) return;
    let history = releaseData.history || {};

    const date = new Date();
    const dateStr = date.toISOString();

    for (let category in categoryValues) {
      if (!categoryValues.hasOwnProperty(category)) continue;

      let historyCategory = history[category] || [];
      if (!isArray(historyCategory)) continue;

      const historyValue = {
        date: dateStr,
        value: categoryValues[category]
      };

      addUniqueValueObjectToArray(historyCategory, historyValue);
      history[category] = historyCategory;
    }

    releaseData.history = history;

    storage.set({ [key]: releaseData }, () => {
      console.log("B2D: Release history for categories was saved successfully", categoryValues);
    });
  });
}

function addUniqueValueObjectToArray(arr, obj) {
  if (arr.length === 0 || arr[arr.length - 1].value !== obj.value) {
      arr.push(obj);
  }
}

function formatDateYMD(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
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
