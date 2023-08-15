'use strict';

injectCSSFile(chrome.runtime.getURL('src/discogs/notification.css'));
injectJSFile(chrome.runtime.getURL('src/discogs/script.js'), () => { console.log('B2D: Discogs script loaded'); });

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
