import { Release } from "../app/release.js";
import { getCurrentUrl } from "../modules/html.js";
import { findReleaseByUrl, logStorage, saveRelease } from "../modules/storage.js";
import { injectCSSFile, injectJSFile } from "../modules/utils.js";
import { PageType, PageTypeDetector } from "./bandcamp.js";
import { getBandPhotoSrc, getReleasesData } from "./html.js";
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

  setupSendMessageToPopup(pageType);
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

/**
 * @param {PageType} pageType
 * @returns
 */
function setupSendMessageToPopup(pageType) {
  if (!pageType.isMusic() && !pageType.isAlbum()) {
    return;
  }

  // Cache main data
  window.B2D = window.B2D || {};

  if (pageType.isMusic()) {
    window.B2D.pageReleases = getReleasesData();
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getBandcampData') {
      if (pageType.isMusic()) {
        sendResponse({
          type: 'list',
          data: window.B2D.pageReleases,
          popup: {
            imageSrc: getBandPhotoSrc(),
            search: getArtistFilterValue(),
          }
        });
      } else {
        const url = window.location.href;

        findReleaseByUrl(url, release => {
          sendResponse({
            type: 'release',
            data: release.toObject()
          });
        });
      }
    }

    return true;
  });
}

function getArtistFilterValue() {
  const artistFilter = document.querySelector('#b2dArtistFilter');
  return artistFilter.value;
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
