import { Release } from "../app/release.js";
import { click, contentChangeWithPolling, createDatalistFromArray, createElementFromHTML, input, isElementDisplayNone, isHtmlElement, selectElementWithContent, setDataAttribute } from "../modules/html.js";
import { getAlbumRelease } from "../modules/schema.js";
import { addReleaseHistory, findReleaseInStorage, saveRelease } from "../modules/storage.js";
import { containsOneOf, splitString, injectCSSFile, injectJSFile, isEmptyArray, countOccurrences, removeBrackets, isObject } from "../modules/utils.js";
import { PageType, PageTypeDetector } from "./bandcamp.js";
import { getBandPhotoSrc, getReleasesData } from "./html.js";

export function main () {
  console.log('B2D: CONTENT AS MODULE');
  const pageType = (new PageTypeDetector()).detect();
  setupReleaseCollectedByWidget(pageType);
  setupIsotope(pageType);
  setupSendMessageToPopup(pageType);
  setupBCDataEventListener(pageType);
  injectJSFile(chrome.runtime.getURL('src/bandcamp/script.js'));
  injectCSSFile(chrome.runtime.getURL('src/bandcamp/styles.css'));
}

function getMusicAlbumSchemaData() {
  const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
  return jsonLdScript ? JSON.parse(jsonLdScript.textContent) : null;
}

function getCurrentUrl() {
  return window.location.href;
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

    findReleaseInStorage(getCurrentUrl(), null, (url) => {
      // Save release data to the storage if it doesn't exist
      const { schemaData, coverSrc } = extractReleaseData();
      const release = Release.fromBandcampData(
        TralbumData,
        BandData,
        schemaData,
        coverSrc
      );

      saveRelease(url, release);
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
 */
function setupReleaseCollectedByWidget(pageType) {
  if (!pageType.isAlbum()) return;

  const musicAlbumData = getMusicAlbumSchemaData();
  const bcCollectedByContainer = document.querySelector('.collected-by');
  const collectedByMessage = bcCollectedByContainer.querySelector('.message');

  const loadingElement = createElementFromHTML('<span class="loading">Bandcamp To Discogs:<br>Calculating revenue information</span>');
  const moreWritingElement = bcCollectedByContainer.querySelector('.more-writing');
  const loadingWritingElement = bcCollectedByContainer.querySelector('.loading-writing');
  const moreThumbsElement = bcCollectedByContainer.querySelector('.more-thumbs');
  const loadingThumbsElement = bcCollectedByContainer.querySelector('.loading-thumbs');

  function outputInformation() {
    const fanElements = bcCollectedByContainer.querySelectorAll('.pic');
    const fanAmount = fanElements.length;
    let sponsoredText = `supported by <strong>${fanAmount}</strong> people.`;

    let categoryValues = {};
    categoryValues.fans = fanAmount;

    const digitalAlbumRelease = getAlbumRelease(musicAlbumData, 'DigitalFormat');
    const cdAlbumRelease = getAlbumRelease(musicAlbumData, 'CDFormat');

    if (isObject(digitalAlbumRelease)) {
      const revenue = fanAmount * digitalAlbumRelease.offers.price;
      sponsoredText += `<br>Digital format potential revenue is ${revenue} ${digitalAlbumRelease.offers.priceCurrency}.`;
      categoryValues.digitalRevenue = revenue;
    }

    if (isObject(cdAlbumRelease)) {
      const revenue = fanAmount * cdAlbumRelease.offers.price;
      sponsoredText += `<br>CD format potential revenue is ${revenue} ${cdAlbumRelease.offers.priceCurrency}.`;
      categoryValues.cdRevenue = revenue;
    }

    collectedByMessage.innerHTML = sponsoredText;
    addReleaseHistory(getCurrentUrl(), categoryValues);
  }

  function clickMoreLinks() {
    const isLoadingThumbs = isHtmlElement(loadingThumbsElement) && !isElementDisplayNone(loadingThumbsElement);
    const isLoadingWritings = isHtmlElement(loadingWritingElement) && !isElementDisplayNone(loadingWritingElement);
    const hasMoreWritings = isHtmlElement(moreWritingElement) && !isElementDisplayNone(moreWritingElement);
    const hasMoreThumbs = isHtmlElement(moreThumbsElement) && !isElementDisplayNone(moreThumbsElement);

    if (!isLoadingWritings && !isLoadingThumbs && !hasMoreWritings && !hasMoreThumbs) {
      clearInterval(intervalId);
      outputInformation();
      return;
    }

    if (!isLoadingWritings && hasMoreWritings) {
      click(moreWritingElement);
    }

    if (!isLoadingThumbs && hasMoreThumbs) {
      click(moreThumbsElement);
    }
  }

  // Show loading indicator
  collectedByMessage.innerHTML = '';
  collectedByMessage.append(loadingElement);
  const intervalId = setInterval(clickMoreLinks, 500);
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

  const artistFilterWidget = createArtistFilterWidget(releases);
  const filterBlock = createElementFromHTML(`<div class="b2d-widget-container"></div>`);
  const albumAmountWidget = createAlbumAmountWidget(releases);

  filterBlock.append(artistFilterWidget);
  filterBlock.append(albumAmountWidget);

  // Prepend to the releases bandcamp page
  document.querySelector('.leftMiddleColumns').prepend(filterBlock);

  setupArtistFilterElement(artistFilterWidget, iso, albumAmountWidget);

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

function createArtistFilterWidget(releases) {
  let artistFilterElement = createElementFromHTML(
`<div class="b2d-widget">
  <label for="b2dArtistFilter">Artist / Album:</label>
  <input list="artist-filter-data" id="b2dArtistFilter" name="artist-filter" />
</div>`);
  const artistFilterData = getArtistListData(releases);
  const artistFilterDatalist = createDatalistFromArray(artistFilterData, 'artist-filter-data');

  artistFilterElement.append(artistFilterDatalist);

  return artistFilterElement;
}

function createAlbumAmountWidget(releases) {
  return createElementFromHTML(
`<div class="b2d-albumAmount b2d-widget" title="The amount of releases on the page">
Releases: <span class="b2d-visible">${releases.length}</span> / <span class="b2d-total">${releases.length}</span>
</div>`);
}

function setupArtistFilterElement(artistFilterElement, iso, albumAmountWidget) {
  const artistFilter = artistFilterElement.querySelector('#b2dArtistFilter');

  artistFilter.addEventListener('input', () => {
    let selectedValue = removeBrackets(artistFilter.value);
    artistFilter.value = selectedValue;

    selectedValue = selectedValue.toLowerCase();
    const filter = selectedValue ? `[data-filter-artist*="${selectedValue}"]` : '*';
    iso.arrange({ filter: filter });

    albumAmountWidget.querySelector('.b2d-visible').innerHTML = iso.getFilteredItemElements().length;

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
