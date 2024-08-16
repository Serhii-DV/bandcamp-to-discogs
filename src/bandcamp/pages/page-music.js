import Isotope from 'isotope-layout';
import {
  contentChangeWithPolling,
  createDatalistFromArray,
  createElementFromHTML,
  input,
  selectElementWithContent,
  setDataAttribute
} from '../../utils/html';
import {
  containsOneOf,
  splitString,
  isEmptyArray,
  countOccurrences,
  removeBrackets
} from '../../utils/utils';
import { getBandPhotoSrc, getReleasesData } from '../modules/html.js';
import { log } from '../../utils/console';

// Setup logic for BC music page
export function setupPageMusic() {
  setupSendMessageToPopup();
  setupIsotope();
}

function setupSendMessageToPopup() {
  // Cache main data
  window.B2D = window.B2D || {};
  window.B2D.pageReleases = getReleasesData();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getBandcampData') {
      sendResponse({
        type: 'list',
        data: window.B2D.pageReleases,
        popup: {
          imageSrc: getBandPhotoSrc(),
          search: getArtistFilterValue()
        }
      });
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

  releases.forEach((release) => {
    const gridElement = grid.querySelector(
      '[data-item-id="' + release.item_id + '"]'
    );
    setDataAttribute(
      gridElement,
      'filter-artist',
      (release.artist + ' - ' + release.title).toLowerCase()
    );
  });

  const artistFilterWidget = createArtistFilterWidget(releases);
  const filterBlock = createElementFromHTML(
    `<div class="b2d-widget-container"></div>`
  );
  const albumAmountWidget = createAlbumAmountWidget(releases);

  filterBlock.append(artistFilterWidget);
  filterBlock.append(albumAmountWidget);

  // Prepend to the releases bandcamp page
  document.querySelector('.leftMiddleColumns').prepend(filterBlock);

  setupArtistFilterElement(artistFilterWidget, iso, albumAmountWidget);

  log('Isotope setup was correct');
}

function getReleases() {
  // Cache main data
  const B2D = window.B2D || {};

  if (!isEmptyArray(B2D.pageReleases)) {
    return B2D.pageReleases;
  }

  B2D.pageReleases = getReleasesData();

  return B2D.pageReleases;
}

function setupArtistFilterElement(artistFilterElement, iso, albumAmountWidget) {
  const artistFilter = artistFilterElement.querySelector('#b2dArtistFilter');

  artistFilter.addEventListener('input', () => {
    let selectedValue = removeBrackets(artistFilter.value);
    artistFilter.value = selectedValue;

    selectedValue = selectedValue.toLowerCase();
    const filter = selectedValue
      ? `[data-filter-artist*="${selectedValue}"]`
      : '*';
    iso.arrange({ filter: filter });

    albumAmountWidget.querySelector('.b2d-visible').innerHTML =
      iso.getFilteredItemElements().length;

    // try to updata images
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'releases-list-search') {
      input(artistFilter, message.search);
    }
  });

  // Check if Bandcamp filter exists
  const bandSelectorContainer = document.querySelector(
    '.leftMiddleColumns .label-band-selector-container'
  );

  if (bandSelectorContainer) {
    let bandMenuTitle = selectElementWithContent(
      bandSelectorContainer,
      '.bands-menu-title span',
      'artists'
    );

    if (!bandMenuTitle) {
      bandMenuTitle = bandSelectorContainer.querySelector(
        '.bands-menu-title span.name'
      );
    }

    if (bandMenuTitle) {
      contentChangeWithPolling(
        bandMenuTitle,
        (newContent) => {
          if (newContent === 'artists') {
            newContent = '';
          }

          input(artistFilter, newContent);
        },
        500
      );
    }
  }
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
  releases.forEach((release) =>
    releasesData.push(release.artist + ' - ' + release.title)
  );
  releasesData.sort();
  filterData.push(...releasesData);

  return [...new Set(filterData)];
}

function createArtistFilterWidget(releases) {
  let artistFilterElement = createElementFromHTML(
    `<div class="b2d-widget">
  <label for="b2dArtistFilter">Artist / Album:</label>
  <input list="artist-filter-data" id="b2dArtistFilter" name="artist-filter" />
</div>`
  );
  const artistFilterData = getArtistListData(releases);
  const artistFilterDatalist = createDatalistFromArray(
    artistFilterData,
    'artist-filter-data'
  );

  artistFilterElement.append(artistFilterDatalist);

  return artistFilterElement;
}

function createAlbumAmountWidget(releases) {
  return createElementFromHTML(
    `<div class="b2d-albumAmount b2d-widget" title="The amount of releases on the page">
Releases: <span class="b2d-visible">${releases.length}</span> / <span class="b2d-total">${releases.length}</span>
</div>`
  );
}
