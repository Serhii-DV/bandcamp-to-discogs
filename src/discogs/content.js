import { injectCSSFile } from '../utils/html';
import { initialize } from './modules/initialization.js';
import {
  getArtistNameInput,
  getReleaseTitleInput
} from './modules/draft-page.js';
import {
  closeNotification,
  showNotificationError,
  showNotificationInfo
} from './modules/notification.js';
import { log } from '../utils/console';

import './css/b2d.css';
import './css/notification.css';

main();

function main() {
  log('Running discogs content main logic (src/discogs/content.js)');

  // Inject concatenated discogs content css
  injectCSSFile(chrome.runtime.getURL('discogs.content.css'));

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
    message +
      '<br><button class="button button-small button-blue action-restart">Restart initialization</button>',
    (notification) => {
      notification
        .querySelector('.action-restart')
        .addEventListener('click', () => {
          initialize();
          closeNotification(notification);
        });
    }
  );
};

function setupSendMessageToPopup() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'B2D_DISCOGS_EDIT_PAGE_DATA') {
      sendResponse(prepareSendMessageData());
    }
  });
}

function prepareSendMessageData() {
  const artistNameInput = getArtistNameInput();
  const releaseTitleInput = getReleaseTitleInput();

  return {
    data: {
      artistName: artistNameInput.value + ' - ' + releaseTitleInput.value
    }
  };
}
