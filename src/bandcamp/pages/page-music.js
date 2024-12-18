import Isotope from 'isotope-layout';
import {
  contentChangeWithPolling,
  createDatalistFromArray,
  createElementFromHTML,
  input,
  listenForMessage,
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
import {
  getBandPhotoSrc,
  getReleaseItems as getReleaseItemsFromPage
} from '../modules/html.js';
import { log } from '../../utils/console';
import { chromeListenToMessage } from '../../utils/chrome';
import { Music } from '../../app/music';
import { ArtistItem } from '../../app/artistItem';
import { Storage, StorageKey } from '../../app/core/storage';
import { MessageType } from '../../app/core/messageType';

const storage = new Storage();

// Setup logic for BC music page
export function setupPageMusic(pageType) {
  listenForMessage('BANDCAMP_DATA', (messageData) => {
    const music = createMusic(messageData.bandData);

    storage.save(music).then(() => {
      savePageData(messageData.pageData);
    });

    setupSendMessageToPopup(pageType, music);
  });
  setupIsotope();
}

function savePageData(pageData) {
  if (!pageData.identities.fan) return;

  const username = pageData.identities.fan.username;
  const url = pageData.identities.fan.url;

  storage.set(StorageKey.BANDCAMP_DATA, {
    user: {
      username,
      url
    }
  });
}

function createMusic(bandData) {
  const artist = new ArtistItem(
    bandData.url,
    bandData.name,
    getBandPhotoSrc(),
    new Date(),
    bandData.id
  );

  return new Music(artist, getReleaseItems());
}

function setupSendMessageToPopup(pageType, music) {
  chromeListenToMessage((message, sender, sendResponse) => {
    if (message.type === MessageType.BANDCAMP_DATA) {
      sendResponse({
        pageType: pageType.value,
        uuid: music.artist.uuid,
        popup: {
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

  const releaseItems = getReleaseItems();

  releaseItems.forEach((releaseItem) => {
    const gridElement = grid.querySelector(
      '[data-item-id="' + releaseItem.id + '"]'
    );
    setDataAttribute(
      gridElement,
      'filter-artist',
      (releaseItem.artist + ' - ' + releaseItem.title).toLowerCase()
    );
  });

  const artistFilterWidget = createArtistFilterWidget(releaseItems);
  const filterBlock = createElementFromHTML(
    `<div class="b2d-widget-container"></div>`
  );
  const albumAmountWidget = createAlbumAmountWidget(releaseItems);

  filterBlock.append(artistFilterWidget);
  filterBlock.append(albumAmountWidget);

  // Prepend to the releases bandcamp page
  document.querySelector('.leftMiddleColumns').prepend(filterBlock);

  setupArtistFilterElement(artistFilterWidget, iso, albumAmountWidget);

  log('Isotope setup was correct');
}

function getReleaseItems() {
  // Cache main data
  const B2D = window.B2D || {};

  if (!isEmptyArray(B2D.releaseItems)) {
    return B2D.releaseItems;
  }

  B2D.releaseItems = getReleaseItemsFromPage();

  return B2D.releaseItems;
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

    albumAmountWidget.querySelector('.b2d-visible').textContent =
      iso.getFilteredItemElements().length;

    // try to updata images
    window.scrollBy(0, 1);
    window.scrollBy(0, -1);
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === MessageType.Search) {
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

function getArtistListData(releaseItems) {
  let filterData = [];
  let artistsData = [];
  let releasesData = [];

  // add artists
  releaseItems.forEach((releaseItem) => {
    if (containsOneOf(releaseItem.artist, ['V/A'])) {
      artistsData.push(releaseItem.artist);
    } else {
      const artists = splitString(releaseItem.artist, /[,/+•|]| Vs | & +/);
      artistsData.push(...artists);
    }
  });
  artistsData.sort();
  filterData.push(...countOccurrences(artistsData));

  // add artists with release titles
  releaseItems.forEach((release) =>
    releasesData.push(release.artist + ' - ' + release.title)
  );
  releasesData.sort();
  filterData.push(...releasesData);

  return [...new Set(filterData)];
}

function createArtistFilterWidget(releaseItems) {
  let artistFilterElement = createElementFromHTML(
    `<div class="b2d-widget">
  <label for="b2dArtistFilter">Artist / Album:</label>
  <input list="artist-filter-data" id="b2dArtistFilter" name="artist-filter" />
</div>`
  );
  const artistFilterData = getArtistListData(releaseItems);
  const artistFilterDatalist = createDatalistFromArray(
    artistFilterData,
    'artist-filter-data'
  );

  artistFilterElement.append(artistFilterDatalist);

  return artistFilterElement;
}

function createAlbumAmountWidget(releaseItems) {
  return createElementFromHTML(
    `<div class="b2d-albumAmount b2d-widget" title="The amount of releases on the page">
Releases: <span class="b2d-visible">${releaseItems.length}</span> / <span class="b2d-total">${releaseItems.length}</span>
</div>`
  );
}
