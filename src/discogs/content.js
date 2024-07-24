'use strict';

importModule('src/discogs/modules/content-main.js');

function importModule(url) {
  (async () => {
    const src = chrome.runtime.getURL(url);
    const contentMain = await import(src);
    contentMain.main();
  })();
}
