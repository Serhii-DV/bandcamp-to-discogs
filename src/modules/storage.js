import { Release } from "../app/release.js";
import { isArray } from "./utils.js";

const storage = chrome.storage.local;

export function findReleaseInStorage(url, onGet) {
  storage.get([url], (result) => {
    if (result[url] && result[url]['release']) {
      const release = createReleaseFromStorageItem(result[url]);
      onGet(release);
    } else {
      console.log("B2D: Release data doesn't exists", url);
    }
  });

}

export function findReleasesInStorage(urls, onGet) {
  storage.get(urls, result => {
    let releases = Object.values(result).map(item => createReleaseFromStorageItem(item));
    onGet(releases);
  });
}

function createReleaseFromStorageItem(storageItem) {
  if (!storageItem.release) {
    throw new Error('Storage items is not Release object');
  }
  return Release.fromJSON(storageItem.release);
}
