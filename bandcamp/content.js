'use strict';

let TralbumData = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'getRelease') {
    console.log('CONTENT LISTENER RELEASE');
    console.log(TralbumData);
    sendResponse({
      TralbumData: TralbumData,
      coverSrc: {
        small: document.querySelector('link[rel~="shortcut"]').href,
        big: document.querySelector('link[rel="image_src"]').href,
      }
    });
  }
});

// Injecting script.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('bandcamp/script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = () => {
  s.remove();
};

window.addEventListener('BC_TralbumData', (e) => {
  // Getting data from script.js
  TralbumData = e.detail;
});
