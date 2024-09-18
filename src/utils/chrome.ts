import { Metadata } from 'src/discogs/app/metadata.js';
import { logInfo } from './console';

export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);
  return tabs[0];
}

export async function getCurrentTabUrl(): Promise<string | undefined> {
  try {
    const currentTab = await getCurrentTab();
    if (currentTab.url) {
      return currentTab.url;
    } else {
      console.warn("The current tab doesn't have a URL.");
      return undefined;
    }
  } catch (error) {
    console.error('Failed to get the current tab URL:', error);
    return undefined;
  }
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

interface B2DTabMessage {
  type: string;
}

export function chromeSendMessageToCurrentTab(
  message: B2DTabMessage,
  responseCallback?: (response: any) => void
): void {
  logInfo('Send message to current tab', message);
  getCurrentTab().then((tab: chrome.tabs.Tab | undefined) => {
    if (!tab?.id) return;
    if (responseCallback) {
      chrome.tabs.sendMessage(tab.id, message, responseCallback);
    } else {
      chrome.tabs.sendMessage(tab.id, message);
    }
  });
}
