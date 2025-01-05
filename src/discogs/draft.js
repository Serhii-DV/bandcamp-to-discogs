import { injectCSSFile } from '../utils/html';
import { setupDraftPage } from './modules/draft/setup';
import {
  getArtistNameInput,
  getReleaseTitleInput
} from './modules/draft/utils';
import {
  closeNotification,
  showNotificationError,
  showNotificationInfo
} from './modules/notification';
import { log } from '../utils/console';

import './css/b2d.css';
import './css/notification.css';
import { MessageType } from '../app/core/messageType';
import { chromeListenToMessage } from '../utils/chrome';

main();

function main() {
  log('Running discogs content main logic (src/discogs/draft.js)');

  // Inject concatenated discogs content css
  injectCSSFile(chrome.runtime.getURL('discogs.draft.css'));

  showNotificationInfo('Waiting for metadata parsing...');

  // Check for Loading placeholder and run initialization
  const checkInterval = 1000;
  const intervalId = setInterval(() => {
    const loadingElement = document.querySelector('.loading-placeholder');
    if (loadingElement) return;

    try {
      setupDraftPage();
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
          setupDraftPage();
          closeNotification(notification);
        });
    }
  );
};

function setupSendMessageToPopup() {
  chromeListenToMessage((message, sender, sendResponse) => {
    if (message.type === MessageType.DiscogsEditPageData) {
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
