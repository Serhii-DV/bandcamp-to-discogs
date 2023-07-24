export async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export function getExtensionManifest() {
  const manifest = chrome.runtime.getManifest();
  return manifest;
}
