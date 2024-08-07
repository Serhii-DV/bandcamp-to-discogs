import { injectCSSFile } from "../../utils/html";
import { initialize } from "./initialization.js";
import { getArtistNameInput, getReleaseTitleInput } from "./draft-page.js";
import { closeNotification, showNotificationError, showNotificationInfo } from "./notification.js";

export function main () {
  console.log('[B2D] Running discogs content main logic (content-main.js)');

  injectCSSFile(chrome.runtime.getURL('b2d.css'));
  injectCSSFile(chrome.runtime.getURL('notification.css'));

  showNotificationInfo('Waiting for metadata parsing...');

  // Check for Loading placeholder and run initialization
  const checkInterval = 1000;
  const intervalId = setInterval(() => {
    const loadingElement = document.querySelector('.loading-placeholder');
    if (loadingElement) return;

    try {
      initialize();
    } catch (error) {
      console.error(error);
      showNotInitializedMessage(error.message);
    }

    clearInterval(intervalId); // Stop checking
  }, checkInterval);

  setupSendMessageToPopup();
}

const showNotInitializedMessage = (message) => {
  showNotificationError(
    message + '<br><button class="button button-small button-blue action-restart">Restart initialization</button>',
    (notification) => {
      notification
        .querySelector('.action-restart')
        .addEventListener('click', () => {
          initialize();
          closeNotification(notification);
        });
    }
  );
}

function setupSendMessageToPopup() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getDiscogsEditPageData') {
      sendResponse(prepareSendMessageData());
    }
  });
}

function prepareSendMessageData() {
  const artistNameInput = getArtistNameInput();
  const releaseTitleInput = getReleaseTitleInput();

  return {
    data: {
      artistName: artistNameInput.value + ' - ' + releaseTitleInput.value,
    }
  };
}
