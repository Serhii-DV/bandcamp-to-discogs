'use strict';

importModule("src/bandcamp/content_module.js");

function importModule(url) {
  (async () => {
    const src = chrome.runtime.getURL(url);
    const contentMain = await import(src);
    contentMain.main();
  })()
}
