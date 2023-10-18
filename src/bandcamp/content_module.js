import { Release } from "../app/release.js";
import { getCurrentUrl } from "../modules/html.js";
import { findReleaseByUrl, logStorage, saveRelease } from "../modules/storage.js";
import { injectCSSFile, injectJSFile } from "../modules/utils.js";
import { PageType, PageTypeDetector } from "./bandcamp.js";
import { setupPageAlbum } from "./page-album.js";
import { setupPageMusic } from "./page-music.js";

export function main () {
  logStorage();
  const pageType = (new PageTypeDetector()).detect();

  if (pageType.isMusic()) {
    setupPageMusic();
  } else if (pageType.isAlbum()) {
    setupPageAlbum();
  }

  setupBCDataEventListener(pageType);
  injectJSFile(chrome.runtime.getURL('src/bandcamp/script.js'));
  injectCSSFile(chrome.runtime.getURL('src/bandcamp/styles.css'));
}

/**
 * @param {PageType} pageType
 * @returns
 */
function setupBCDataEventListener(pageType) {
  if (!pageType.isAlbum()) {
    return;
  }

  window.addEventListener('BC_Data', (e) => {
    // Getting data from script.js
    const {TralbumData, BandData} = e.detail;

    findReleaseByUrl(getCurrentUrl(), null, (url) => {
      // Save release data to the storage if it doesn't exist
      const { schemaData, coverSrc } = extractReleaseData();
      const release = Release.fromBandcampData(
        TralbumData,
        BandData,
        schemaData,
        coverSrc
      );

      saveRelease(release);
    });
  });
}

function extractReleaseData() {
  return {
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
