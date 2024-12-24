import { MessageType } from '../app/core/messageType';
import { Metadata } from '../discogs/app/metadata';
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

export async function openTabsAndClose(url: string[]): Promise<unknown[]> {
  return openTabs(url, (tab) => {
    if (tab.id) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          func: () => {
            setTimeout(() => window.close(), 1000);
          }
        })
        .then(() => {});
    }
  });
}

export function getExtensionUrl(path: string): string {
  return chrome.runtime.getURL(path);
}

interface B2DTabMessage {
  type: MessageType;
  metadata?: Metadata;
}

type ResponseCallback = (response: any) => void;

export function chromeSendMessageToTab(
  message: B2DTabMessage,
  tab: chrome.tabs.Tab | undefined
): Promise<void> {
  logInfo('Send message to tab', { message, tab });
  return new Promise((resolve, reject) => {
    if (!tab?.id) {
      reject('Tab is missing');
      return;
    }

    chrome.tabs.sendMessage(tab.id, message, (response) => {
      logInfo('Received message from the tab', { message, response });
      resolve();
    });
  });
}

export function chromeSendMessageToCurrentTab(
  message: B2DTabMessage,
  onValidResponseCallback?: ResponseCallback,
  onInvalidResponseCallback?: ResponseCallback,
  responseCallback?: ResponseCallback
): void {
  logInfo('Send message to current tab', message);
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

export function chromeListenToMessage(
  callback: (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => void
): void {
  chrome.runtime.onMessage.addListener(callback);
}
