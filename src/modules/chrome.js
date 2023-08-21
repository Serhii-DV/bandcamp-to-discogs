export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export function getExtensionManifest() {
  const manifest = chrome.runtime.getManifest();
  return manifest;
}

export async function openTabs(urls, callback) {
  for (const url of urls) {
    await chrome.tabs.create({ url, active: false }, callback);
  }
}
