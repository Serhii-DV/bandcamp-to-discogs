import { isFunction } from "./utils.js";

export async function getCurrentTab(callback) {
  let queryOptions = { active: true, currentWindow: true };

  if (isFunction(callback)) {
    chrome.tabs.query(queryOptions, callback);
    return;
  }

  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export function getExtensionManifest() {
  const manifest = chrome.runtime.getManifest();
  return manifest;
}

export async function openTabs(urls, callback) {
  const tabPromises = [];

  for (const url of urls) {
    const tabPromise = new Promise((resolve) => {
      chrome.tabs.create({ url, active: false }, (tab) => {
        if (callback) {
          callback(tab);
        }
        resolve(tab);
      });
    });

    tabPromises.push(tabPromise);
  }

  return Promise.all(tabPromises);
}
