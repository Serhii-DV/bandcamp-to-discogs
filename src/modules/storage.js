import { Release } from "../app/release.js";
import { isValidBandcampURL } from "../bandcamp/html.js";
import { generateKeyForRelease, generateKeyForUrl, generateKeyUrlMapFromUrls, generateKeysFromUrls } from "./key-generator.js";
import { isArray, isFunction, isObject } from "./utils.js";

const storage = chrome.storage.local;

export function logStorage() {
  console.log('B2D: Storage data');
  storage.get(null, (data) => console.log(data));
}

export function findAllReleases(onFind) {
  storage.get(null, (data) => {
    const releases = [];

    for (const key in data) {
      if (!data.hasOwnProperty(key) && !isObject(data[key])) {
        continue;
      }

      const release = data[key];

      if (isValidBandcampURL(release.url)) {
        releases.push(release);
      }
    }

    if (isFunction(onFind)) onFind(releases);
  });
}

export function findReleaseByUrl(url, onFind, onMissing) {
  const key = generateKeyForUrl(url);
  storage.get([key], (result) => {
    if (isObject(result[key])) {
      const release = Release.fromObject(result[key]);
      if (isFunction(onFind)) onFind(release);
    } else {
      console.log("B2D: Release data doesn't exists", key);
      if (isFunction(onMissing)) onMissing(key);
    }
  });

}

export function findReleasesByUrls(urls, onFind) {
  const keys = generateKeysFromUrls(urls);
  storage.get(keys, result => {
    let releases = Object.values(result).map(obj => Release.fromObject(obj));
    if (isFunction(onFind)) onFind(releases);
  });
}

export function findMissingUrls(urls, onFind) {
  const keyUrlMap = generateKeyUrlMapFromUrls(urls);
  const keys = Object.keys(keyUrlMap);
  storage.get(keys, result => {
    const foundKeys = Object.keys(result);
    const missingKeys = keys.filter(key => !foundKeys.includes(key));
    const missingUrls = missingKeys.map(key => keyUrlMap[key]);
    if (isFunction(onFind)) onFind(missingUrls);
  });
}

/**
 * @param {Release} release
 */
export function saveRelease(release) {
  const key = generateKeyForRelease(release);
  storage.set({ [key]: release.toObject() }, () => {
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
