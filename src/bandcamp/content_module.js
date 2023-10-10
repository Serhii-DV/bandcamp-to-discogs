import { Release } from "../app/release.js";
import { contentChangeWithPolling, createDatalistFromArray, createElementFromHTML, input, selectElementWithContent, setDataAttribute } from "../modules/html.js";
import { containsOneOf, splitString, injectCSSFile, injectJSFile, isEmptyArray, countOccurrences, removeBrackets } from "../modules/utils.js";
import { PageType, PageTypeDetector } from "./bandcamp.js";
import { getBandPhotoSrc, getReleasesData } from "./html.js";

export function main () {
  console.log('B2D: CONTENT AS MODULE');
  const pageType = (new PageTypeDetector()).detect();

  setupIsotope(pageType);
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
    window.B2D.page_releases = getReleasesData();
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    let response;

    if (request.type === 'getBandcampData') {
      if (pageType.isMusic()) {
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

/**
 * @param {PageType} pageType
 * @returns
 */
function setupIsotope(pageType) {
  if (!pageType.isMusic()) {
    return;
  }

  let grid = document.querySelector('#music-grid');
  let iso = new Isotope(grid, {
    itemSelector: '.music-grid-item',
    layoutMode: 'fitRows'
  });

  const releases = getReleases();

  releases.forEach(release => {
    const gridElement = grid.querySelector('[data-item-id="' + release.item_id + '"]');
    setDataAttribute(gridElement, 'filter-artist', (release.artist + ' - ' + release.title).toLowerCase());
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
      const artists = splitString(release.artist, /[,/+•|]| Vs | & +/);
      artistsData.push(...artists);
    }
  });
  artistsData.sort();
  filterData.push(...countOccurrences(artistsData));

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
    let selectedValue = removeBrackets(artistFilter.value);
    artistFilter.value = selectedValue;

    selectedValue = selectedValue.toLowerCase();
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

  // Check if Bandcamp filter exists
  const bandSelectorContainer = document.querySelector('.leftMiddleColumns .label-band-selector-container');

  if (bandSelectorContainer) {
    let bandMenuTitle = selectElementWithContent(bandSelectorContainer, '.bands-menu-title span', 'artists');

    if (!bandMenuTitle) {
      bandMenuTitle = bandSelectorContainer.querySelector('.bands-menu-title span.name');
    }

    if (bandMenuTitle) {
      contentChangeWithPolling(bandMenuTitle, (newContent) => {
        if (newContent === 'artists') {
          newContent = '';
        }

        input(artistFilter, newContent);
      }, 500);
    }
  }

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
