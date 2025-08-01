import Isotope from 'isotope-layout';
import {
  contentChangeWithPolling,
  createDatalistFromArray,
  createElementFromHTML,
  input,
  listenForMessage,
  onClick,
  selectElementWithContent,
  setDataAttribute,
  triggerInputEvent
} from '../../utils/html';
import { isEmptyArray, countOccurrences } from '../../utils/utils';
import {
  extractFilterInputStyle,
  getBandPhotoSrc,
  getReleaseItems as getReleaseItemsFromPage
} from '../modules/html';
import { log, logError } from '../../utils/console';
import { chromeListenToMessage } from '../../utils/chrome';
import { Music } from '../../app/music';
import { ArtistItem } from '../../app/artistItem';
import { Storage, StorageKey } from '../../app/core/storage';
import { MessageType } from '../../app/core/messageType';
import { removeBrackets } from '../../utils/string';

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
    if (message.type === MessageType.BandcampData) {
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
      '[data-item-id="album-' + releaseItem.id + '"]'
    );

    if (!gridElement) {
      logError('Could not find grid element for release item', releaseItem);
      return;
    }

    setDataAttribute(
      gridElement,
      'filter-artist',
      (releaseItem.artist + ' - ' + releaseItem.title).toLowerCase()
    );
  });

  const bcStyle = extractFilterInputStyle();
  const artistFilterWidget = createArtistFilterWidget(releaseItems, bcStyle);
  const albumAmountWidget = createAlbumAmountWidget(releaseItems, bcStyle);

  const filterBlock = createElementFromHTML(
    `<div class="b2d-widget-container"></div>`
  );
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

  chromeListenToMessage((message) => {
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
    artistsData.push(...releaseItem.artists);
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

function createArtistFilterWidget(releaseItems, bcStyle) {
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
  const artistFilterInput =
    artistFilterElement.querySelector('#b2dArtistFilter');
  artistFilterInput.style.backgroundColor = bcStyle?.backgroundColor;
  artistFilterInput.style.color = bcStyle?.color;

  artistFilterElement.append(artistFilterDatalist);

  const clearButton = createElementFromHTML(
    `<button id="b2dArtistFilterClear" title="Clear the filter">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
</svg>
  </button>`
  );

  onClick(clearButton, () => {
    artistFilterInput.value = '';
    triggerInputEvent(artistFilterInput);
  });

  artistFilterElement.append(clearButton);

  return artistFilterElement;
}

function createAlbumAmountWidget(releaseItems, bcStyle) {
  const widget = createElementFromHTML(
    `<div class="b2d-albumAmount b2d-widget" title="The displayed and total amount of albums on the page">
Displayed: <span class="b2d-badge b2d-visible">${releaseItems.length}</span> Total: <span class="b2d-badge b2d-total">${releaseItems.length}</span>
</div>`
  );
  const badges = widget.querySelectorAll('.b2d-badge');
  badges?.forEach((badge) => {
    badge.style.backgroundColor = bcStyle?.backgroundColor;
    badge.style.color = bcStyle?.color;
  });

  return widget;
}
