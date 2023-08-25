import { Release } from "../app/release.js";
import { isArray } from "./utils.js";

const storage = chrome.storage.local;

export function findReleaseInStorage(url, onFind) {
  storage.get([url], (result) => {
    if (result[url] && result[url]['release']) {
      const release = createReleaseFromStorageItem(result[url]);
      onFind(release);
    } else {
      console.log("B2D: Release data doesn't exists", url);
    }
  });

}

export function findReleasesInStorage(urls, onFind) {
  storage.get(urls, result => {
    let releases = Object.values(result).map(item => createReleaseFromStorageItem(item));
    onFind(releases);
  });
}

export function findMissingKeysInStorage(keys, onFind) {
  storage.get(keys, result => {
    let foundKeys = Object.keys(result);
    let missingKeys = keys.filter(key => !foundKeys.includes(key));
    onFind(missingKeys);
  });
}

function createReleaseFromStorageItem(storageItem) {
  if (!storageItem.release) {
    throw new Error('Storage items is not Release object');
  }
  return Release.fromJSON(storageItem.release);
}
