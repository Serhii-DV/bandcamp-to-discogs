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

type ResponseCallback = (response: any) => void;

export function chromeSendMessageToCurrentTab(
  message: B2DTabMessage,
  onValidResponseCallback?: ResponseCallback,
  onInvalidResponseCallback?: ResponseCallback,
  responseCallback?: ResponseCallback
): void {
  logInfo('Send message to current tab', message.type, message);
  getCurrentTab().then((tab: chrome.tabs.Tab | undefined) => {
    if (!tab?.id) return;

    if (onValidResponseCallback) {
      chrome.tabs.sendMessage(tab.id, message, (response) => {
        logInfo(
          'Received message from the current tab',
          message.type,
          response
        );

        if (
          response === null ||
          typeof response === 'undefined' ||
          Object.keys(response).length === 0
        ) {
          if (onInvalidResponseCallback) {
            onInvalidResponseCallback(response);
          }

          return;
        }

        onValidResponseCallback(response);
      });
    } else if (responseCallback) {
      chrome.tabs.sendMessage(tab.id, message, responseCallback);
    } else {
      chrome.tabs.sendMessage(tab.id, message);
    }
  });
}
