import { injectCSSFile, observeAttributeChange } from "../../modules/html.js";
import { initialize } from "../script.js";
import { getArtistNameInput, getReleaseTitleInput } from "./draft-page.js";
import { closeNotification, showNotificationError, showNotificationInfo } from "./notification.js";

export function main () {
  console.log('[B2D] Running discogs content main logic (content-main.js)');

  injectCSSFile(chrome.runtime.getURL('src/discogs/css/b2d.css'));
  injectCSSFile(chrome.runtime.getURL('src/discogs/notification.css'));

  showNotificationInfo('Initialization...');

  const html = document.querySelector('html');

  observeAttributeChange(html, 'class', (el) => {
    if (el.classList.contains('de-enabled') && !el.classList.contains('b2d-initialized')) {
      // Initialize the script after some period of time. We have to wait for elements initializing on the page.
      setTimeout(() => {
        try {
          initialize();
        } catch (error) {
          console.error(error);
          showNotInitializedMessage();
        }
      }, 5000);
      el.classList.add('b2d-initialized');
    }
  });

  setupSendMessageToPopup();
}

const showNotInitializedMessage = () => {
  showNotificationError(
    'Not initialized!<br><button class="button button-small button-blue action-restart">Restart initialization</button>',
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

    return true;
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
