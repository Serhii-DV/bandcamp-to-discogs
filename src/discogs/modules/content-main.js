export function main () {
  console.log('B2D: content-main.js', chrome);
  injectCSSFile(chrome.runtime.getURL('src/discogs/notification.css'));
  injectJSFile(chrome.runtime.getURL('src/discogs/script.js'), () => { console.log('B2D: Discogs script loaded', chrome); });

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
  const artistNameInput = document.getElementById('artist-name-input');

  return {
    data: {
      artistName: artistNameInput.getAttribute('value'),
    }
  };
}
