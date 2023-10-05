'use strict';

let TralbumData, BandData = {};

function extractReleaseData() {
  return {
    tralbumData: TralbumData,
    bandData: BandData,
    schemaData: getSchemaData(),
    coverSrc: {
      small: document.querySelector('link[rel~="shortcut"]').href,
      big: document.querySelector('link[rel="image_src"]').href,
    },
  };
}

function getSchemaData() {
  const scriptElement = document.querySelector('script[type="application/ld+json"]');
  const scriptContent = scriptElement.textContent;
  return JSON.parse(scriptContent);
}

importModule("src/bandcamp/content_module.js");

function importModule(url) {
  (async () => {
    const src = chrome.runtime.getURL(url);
    const contentMain = await import(src);
    contentMain.main();
  })()
}
