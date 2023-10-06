import { Release } from "../app/release.js";
import { createDatalistFromArray, createElementFromHTML, input, setDataAttribute } from "../modules/html.js";
import { containsOneOf, explodeString, injectCSSFile, injectJSFile, isEmptyArray } from "../modules/utils.js";
import { isReleasesListPage } from "./bandcamp.js";
import { getBandPhotoSrc, getReleasesData } from "./html.js";

export function main () {
  console.log('B2D: CONTENT AS MODULE');

  if (isReleasesListPage()) {
    setupIsotope();
  }

  setupSendMessageToPopup();
  setupBCDataEventListener();
  injectJSFile(chrome.runtime.getURL('src/bandcamp/script.js'));
  injectCSSFile(chrome.runtime.getURL('src/bandcamp/styles.css'));
}

function setupBCDataEventListener() {
  window.addEventListener('BC_Data', (e) => {
    if (isReleasesListPage()) {
      // Do nothing
      return;
    }

    // Getting data from script.js
    const {TralbumData, BandData} = e.detail;
    const currentTabUrl = window.location.href;
    const storage = chrome.storage.local;

    // storage.clear();

    storage.get([currentTabUrl], (result) => {
      // Save release data to the storage if it doesn't exist
      if (!result[currentTabUrl] || !result[currentTabUrl]['release']) {
        const { schemaData, coverSrc } = extractReleaseData();
        const release = Release.fromBandcampData(
          TralbumData,
          BandData,
          schemaData,
          coverSrc
        );

        storage.set({ [currentTabUrl]: { release: release.toJSON() } }, () => {
          console.log("B2D: Release data was saved in local storage");
        });
      } else {
        console.log("B2D: Release data already exists");
      }
    });
  });
}

function setupSendMessageToPopup() {
  // Cache main data
  window.B2D = window.B2D || {};

  if (isReleasesListPage()) {
    window.B2D.page_releases = getReleasesData();
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let response;

    if (request.type === 'getBandcampData') {
      if (isReleasesListPage()) {
        sendResponse({
          type: 'list',
          data: window.B2D.page_releases,
          popup: {
            imageSrc: getBandPhotoSrc(),
            search: getArtistFilterValue(),
          }
        });
      } else {
        const currentTabUrl = window.location.href;
        chrome.storage.local.get([currentTabUrl], (result) => {
          if (result[currentTabUrl] && result[currentTabUrl]['release']) {
            response = {
              type: 'release',
              data: result[currentTabUrl]['release']
            };
          }

          sendResponse(response);
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

function setupIsotope() {
  let grid = document.querySelector('#music-grid');
  let iso = new Isotope(grid, {
    itemSelector: '.music-grid-item',
    layoutMode: 'fitRows'
  });

  const releases = getReleases();

  releases.forEach(release => {
    const gridElement = grid.querySelector('[data-item-id="' + release.item_id + '"]');
    setDataAttribute(gridElement, 'filter-artist', release.artist + ' - ' + release.title);
  });

  const artistFilterElement = createArtistFilterElement(releases);
  const filterBlock = createElementFromHTML(`<div class="b2d-widget-container"></div>`);
  filterBlock.append(artistFilterElement);

  // Prepend to the releases bandcamp page
  document.querySelector('.leftMiddleColumns').prepend(filterBlock);

  setupArtistFilterElement(artistFilterElement, iso);

  console.log('B2D: Isotope setuped correctly');
}

function getReleases() {
  if (!isReleasesListPage()) {
    return [];
  }

  // Cache main data
  const B2D = window.B2D || {};

  if (!isEmptyArray(B2D.page_releases)) {
    return B2D.page_releases;
  }

  B2D.page_releases = getReleasesData();

  return B2D.page_releases;
}

function getArtistListData(releases) {
  let filterData = [];
  let artistsData = [];
  let releasesData = [];

  // add artists
  releases.forEach((release) => {
    if (containsOneOf(release.artist, ['V/A'])) {
      artistsData.push(release.artist);
    } else {
      const artists = explodeString(release.artist);
      artistsData.push(...artists);
    }
  });
  artistsData.sort();
  filterData.push(...artistsData);

  // add artists with release titles
  releases.forEach((release) => releasesData.push(release.artist + ' - ' + release.title));
  releasesData.sort();
  filterData.push(...releasesData);

  return [...new Set(filterData)];
}

function createArtistFilterElement(releases) {
  let artistFilterElement = createElementFromHTML(
`<div class="b2d-artist-filter-widget">
  <label for="b2dArtistFilter">Artists:</label>
  <input list="artist-filter-data" id="b2dArtistFilter" name="artist-filter" />
</div>`);
  const artistFilterData = getArtistListData(releases);
  const artistFilterDatalist = createDatalistFromArray(artistFilterData, 'artist-filter-data');

  artistFilterElement.append(artistFilterDatalist);

  return artistFilterElement;
}

function setupArtistFilterElement(artistFilterElement, iso) {
  const artistFilter = artistFilterElement.querySelector('#b2dArtistFilter');
  artistFilter.addEventListener('input', () => {
    const selectedValue = artistFilter.value;
    const filter = selectedValue ? `[data-filter-artist*="${selectedValue}"]` : '*';
    iso.arrange({ filter: filter });

    // try to updata images
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'releases-list-search') {
      input(artistFilter, message.search);
    }
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
