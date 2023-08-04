'use strict';

// Injecting script.js
var s = document.createElement('script');
s.src = chrome.runtime.getURL('src/discogs/script.js');
(document.head||document.documentElement).appendChild(s);
s.onload = () => {
  s.remove();
};
