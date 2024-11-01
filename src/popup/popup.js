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
import { disable, enable, click } from '../utils/html';
import { setupCsvDataTab } from './tabs/csv_data_tab.js';
import { bytesToSize } from '../utils/utils';
import { setupConsole, setupConsoleRelease } from './console.js';
import { isValidDiscogsReleaseEditUrl } from '../discogs/app/utils.js';
import { logInfo } from '../utils/console';
import { setupBandcampTab } from './tabs/bandcamp_tab.js';
import {
  getReleaseCardTabElement,
  showReleasesTabContent,
  showReleaseCardTab,
  setupReleasesTabElement
} from './modules/main';
import { setupReleasesTab } from './tabs/releases_tab.js';
import { setupReleaseCardTab } from './tabs/release-card_tab.js';
import { PageTypeEnum } from '../bandcamp/app/page-type.js';
import { isValidBandcampURL } from '../bandcamp/modules/url';
import { Storage } from '../app/core/storage';
import { removeNonUuidRecordsFromStorage } from '../utils/storage';

globalThis.storage = new Storage();
const storage = globalThis.storage;
const btnBandcampTab = document.getElementById('bandcamp-tab');
const btnReleaseCardTab = getReleaseCardTabElement();
const btnCsvDataTab = document.getElementById('csvData-tab');
const btnHistoryTab = document.getElementById('history-tab');

async function proceedBandcampData() {
  logInfo('Proceed Bandcamp data');

  chromeSendMessageToCurrentTab(
    { type: 'B2D_BC_DATA' },
    processBandcampResponse,
    showBandcampTab
  );
}

async function proceedDiscogsEditPageData() {
  logInfo('Proceed Discogs edit page data');

  chromeSendMessageToCurrentTab(
    { type: 'B2D_DISCOGS_EDIT_PAGE_DATA' },
    processDiscogsDraftPageResponse
  );
}

function showBandcampTab() {
  disable(btnCsvDataTab);
  click(btnBandcampTab);
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
          setupConsoleRelease(release, keywordsMapping, response.schema);
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
    setupCsvDataTab(release, btnCsvDataTab);
  } catch (error) {
    console.error(error);
  }
}

function processDiscogsDraftPageResponse(response) {
  disable(btnCsvDataTab);
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

  btnReleaseCardTab.addEventListener('click', () => {
    enable(btnCsvDataTab);
  });

  btnHistoryTab.addEventListener('click', () => {
    setupHistoryTab(document.getElementById('history'));
  });

  setupBandcampTab(btnHistoryTab);
  setupReleasesTabElement();
}

function initialize(tab) {
  const currentTabUrl = tab.url;

  logInfo('Popup initialization');
  logInfo('Current URL', currentTabUrl);

  setupConsole();
  setupNavigation();
  replaceVersion(document);
  checkStorageSize();

  setupReleaseCardTab();
  setupReleasesTab();

  if (isValidBandcampURL(currentTabUrl)) {
    proceedBandcampData();
  } else if (isValidDiscogsReleaseEditUrl(currentTabUrl)) {
    proceedDiscogsEditPageData();
  } else {
    showBandcampTab();
  }

  // TODO: Remove this logic in the release 0.19.0
  removeNonUuidRecordsFromStorage();
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
