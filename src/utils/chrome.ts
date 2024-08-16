import { Metadata } from 'src/discogs/app/metadata.js';

export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  return tabs[0];
}

export function getExtensionManifest(): chrome.runtime.Manifest {
  return chrome.runtime.getManifest();
}

export async function openTabs(
  urls: string[],
  callback: (tab: chrome.tabs.Tab) => void
): Promise<unknown[]> {
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

export function getExtensionUrl(path: string): string {
  return chrome.runtime.getURL(path);
}

interface MetadataMessage {
  type: string;
  metadata: Metadata;
}

export function chromeSendMessageToCurrentTab(
  message: MetadataMessage,
  responseCallback?: (response: any) => void
): void {
  getCurrentTab().then((tab: chrome.tabs.Tab | undefined) => {
    if (!tab?.id) return;
    if (responseCallback) {
      chrome.tabs.sendMessage(tab.id, message, responseCallback);
    } else {
      chrome.tabs.sendMessage(tab.id, message);
    }
  });
}
