import { observeAttributeChange } from "../../modules/html.js";
import { runScript } from "../script.js";
import { getArtistNameInput, getReleaseTitleInput } from "./draft-page.js";

export function main () {
  console.log('B2D: content-main.js');
  injectCSSFile(chrome.runtime.getURL('src/discogs/notification.css'));

  observeAttributeChange(document.querySelector('html'), 'class', (el) => {
    if (el.classList.contains('de-enabled') && !el.classList.contains('b2d-script-injected')) {
      runScript();
      el.classList.add('b2d-script-injected');
    }
  });

  setupSendMessageToPopup();
}

/**
 * @param {String} cssUrl
 */
function injectCSSFile(cssUrl) {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = cssUrl;

  document.head.appendChild(linkElement);
}

function injectJSFile(url, callback) {
  const s = document.createElement('script');
  s.src = url;
  s.onload = callback;
  (document.head||document.documentElement).appendChild(s);
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
