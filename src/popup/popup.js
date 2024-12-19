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
import { loadDiscogsGenres } from '../discogs/modules/genres.js';
import { loadKeywordMapping } from '../bandcamp/modules/mapping.js';
import config from '../config.js';
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
import { isValidDiscogsReleaseEditUrl } from '../discogs/app/utils.js';
import { logInfo } from '../utils/console';
import { setupBandcampTab } from './tabs/bandcamp_tab.js';
import {
  showReleasesTabContent,
  showReleaseCardTab,
  setupNavigationLinks,
  getHistoryTabElement,
  getHistoryContentElement,
  showBandcampTab
} from './modules/main';
import { setupReleasesTab } from './tabs/releases_tab.js';
import { setupReleaseCardTab } from './tabs/release-card_tab.js';
import { PageTypeEnum } from '../bandcamp/app/page-type.js';
import { isValidBandcampURL } from '../bandcamp/modules/url';
import { Storage } from '../app/core/storage';
import { removeNonUuidRecordsFromStorage } from '../utils/storage';
import { MessageType } from '../app/core/messageType';

globalThis.storage = new Storage();
const storage = globalThis.storage;

async function proceedBandcampData() {
  logInfo('Proceed Bandcamp data');

  chromeSendMessageToCurrentTab(
    { type: MessageType.BandcampData },
    processBandcampResponse,
    showBandcampTab
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
    loadDiscogsGenres(config.genres_url).then(() => {
      loadKeywordMapping(config.keyword_mapping_url).then((keywordsMapping) => {
        storage.getByUuid(response.uuid).then((release) => {
          setupConsoleLogKeywordsMapping(keywordsMapping);
          setupConsoleLogRelease(release);
          setupConsoleLogSchema(response.schema);
          processBandcampPageAlbumResponse(
            release,
            response.schema,
            keywordsMapping
          );
        });
      });
    });
  } else if (isPageMusic) {
    storage.getByUuid(response.uuid).then((music) => {
      showReleasesTabContent(music, response.popup.search);
    });
  }
}

function processBandcampPageAlbumResponse(release) {
  try {
    showReleaseCardTab(release);
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
    showBandcampTab();
  }

  // TODO: Remove this logic in the release 0.19.0
  removeNonUuidRecordsFromStorage(storage);
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
