import 'bootstrap';

// Popup styles
import './popup.css';
import './css/release-card.css';
import './css/releases-group-list.css';

// Custom components
import './components/icon';
import './components/console-command.js';
import './components/releases-list.js';
import './components/releases-group-list-element.ts';
import '@github/relative-time-element';

import {
  chromeSendMessageToCurrentTab,
  getCurrentTab,
  getExtensionManifest
} from '../utils/chrome';
import {
  setHistoryTabSearchValue,
  setupHistoryTab
} from './tabs/history_tab.js';
import { click } from '../utils/html';
import { bytesToSize } from '../utils/utils';
import {
  setupConsoleLogStorage,
  setupConsoleLogKeywordsMapping,
  setupConsoleLogRelease,
  setupConsoleLogSchema
} from './console.js';
import { isValidDiscogsReleaseEditUrl } from '../discogs/app/utils';
import { logInfo } from '../utils/console';
import { setupBandcampTab } from './tabs/bandcamp_tab.js';
import {
  showReleases,
  showReleaseCard,
  setupNavigationLinks,
  getHistoryTabElement,
  getHistoryContentElement,
  showLatestViewed
} from './modules/main';
import { setupReleasesTab } from './tabs/releases_tab.js';
import { setupReleaseCardTab } from './tabs/release-card_tab.js';
import { PageTypeEnum } from '../bandcamp/app/page-type';
import { Storage } from '../app/core/storage';
import { MessageType } from '../app/core/messageType';
import { isValidBandcampURL } from '../app/core/bandcampUrl';

globalThis.storage = new Storage();
const storage = globalThis.storage;

async function proceedBandcampData() {
  logInfo('Proceed Bandcamp data');

  chromeSendMessageToCurrentTab(
    { type: MessageType.BandcampData },
    processBandcampResponse,
    showLatestViewed
  );
}

async function proceedDiscogsEditPageData() {
  logInfo('Proceed Discogs edit page data');

  chromeSendMessageToCurrentTab(
    { type: MessageType.DiscogsEditPageData },
    processDiscogsDraftPageResponse
  );
}

function processBandcampResponse(response) {
  const isPageAlbum = response.pageType === PageTypeEnum.ALBUM;
  const isPageMusic = response.pageType === PageTypeEnum.MUSIC;

  if (!isPageAlbum && !isPageMusic) {
    // todo: Show error?
    return;
  }

  if (isPageAlbum) {
    storage.getByUuid(response.uuid).then((release) => {
      setupConsoleLogKeywordsMapping();
      setupConsoleLogRelease(release);
      setupConsoleLogSchema(response.schema);
      processBandcampPageAlbumResponse(release);
    });
  } else if (isPageMusic) {
    storage.getByUuid(response.uuid).then((music) => {
      showReleases(music, response.popup.search);
    });
  }
}

function processBandcampPageAlbumResponse(release) {
  try {
    showReleaseCard(release);
  } catch (error) {
    console.error(error);
  }
}

function processDiscogsDraftPageResponse(response) {
  const btnHistoryTab = getHistoryTabElement();
  click(btnHistoryTab);
  setHistoryTabSearchValue(response.data.artistName);
}

function replaceVersion(document) {
  logInfo('Replace extension version');
  const manifest = getExtensionManifest();

  // Set extension version
  document.querySelectorAll('.version').forEach((el) => {
    el.textContent = manifest.version;
  });
}

function setupNavigation() {
  logInfo('Setup navigation');

  const btnHistoryTab = getHistoryTabElement();
  setupBandcampTab(btnHistoryTab, storage);
  setupHistoryTab(btnHistoryTab, getHistoryContentElement(), storage);
  setupNavigationLinks(storage);
}

function initialize(tab) {
  const currentTabUrl = tab.url;

  logInfo('Popup initialization');
  logInfo('Current URL', currentTabUrl);

  setupConsoleLogStorage(storage);
  setupNavigation();
  replaceVersion(document);
  checkStorageSize();

  setupReleaseCardTab();
  setupReleasesTab(storage);

  if (isValidBandcampURL(currentTabUrl)) {
    proceedBandcampData();
  } else if (isValidDiscogsReleaseEditUrl(currentTabUrl)) {
    proceedDiscogsEditPageData();
  } else {
    showLatestViewed();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTab().then((tab) => {
    initialize(tab);
  });
});

function checkStorageSize() {
  storage.getSize().then((size) => {
    document.querySelectorAll('.storage-size').forEach((el) => {
      el.textContent = bytesToSize(size);
      el.setAttribute('title', `Storage size (${size} bytes)`);
    });
  });
}
