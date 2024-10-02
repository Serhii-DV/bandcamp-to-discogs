import 'bootstrap';

// Popup styles
import './popup.css';
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
import { disable, enable, hide, show, click } from '../utils/html';
import { setupReleasesTab } from './tabs/releases_tab.js';
import { setupCsvDataTab } from './tabs/csv_data_tab.js';
import { getStorageSize } from '../utils/storage';
import { bytesToSize } from '../utils/utils';
import { setupConsole, setupConsoleRelease } from './console.js';
import { isValidBandcampURL } from '../bandcamp/modules/html.js';
import { isValidDiscogsReleaseEditUrl } from '../discogs/app/utils.js';
import { logInfo } from '../utils/console';
import { createReleaseFromSchema } from '../utils/schema';
import { setupBandcampTab } from './tabs/bandcamp_tab.js';
import { showReleaseTab } from './modules/main';

const btnBandcampTab = document.getElementById('bandcamp-tab');
const btnReleaseTab = document.getElementById('release-tab');
const btnReleasesTab = document.getElementById('releases-tab');
const btnCsvDataTab = document.getElementById('csvData-tab');
const btnHistoryTab = document.getElementById('history-tab');
const btnDownloadRelease = document.getElementById('downloadRelease');
const btnDownloadReleases = document.getElementById('downloadReleases');
const btnDownloadStorage = document.getElementById('downloadHistory');
const tabReleases = document.getElementById('releases');

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
  hide(btnReleasesTab);
  show(btnDownloadReleases);
  click(btnBandcampTab);
}

function processBandcampResponse(response) {
  const isPageAlbum = response.type === 'TYPE_PAGE_ALBUM';
  const isPageMusic = response.type === 'TYPE_PAGE_MUSIC';

  if (!isPageAlbum && !isPageMusic) {
    // todo: Show error?
    return;
  }

  loadDiscogsGenres(config.genres_url).then(() => {
    loadKeywordMapping(config.keyword_mapping_url).then((keywordsMapping) => {
      if (isPageAlbum) {
        processBandcampPageAlbumResponse(response, keywordsMapping);
      } else if (isPageMusic) {
        processBandcampPageMusicResponse(response);
      }
    });
  });
}

function processBandcampPageAlbumResponse(response, keywordsMapping) {
  try {
    const schema = response.schema;
    const release = createReleaseFromSchema(schema);
    setupConsoleRelease(release, keywordsMapping, schema);
    showReleaseTab(release);
    setupCsvDataTab(release, btnCsvDataTab);
  } catch (error) {
    console.error(error);
  }
}

function processBandcampPageMusicResponse(response) {
  hide(btnReleaseTab);
  show(btnReleasesTab);
  click(btnReleasesTab);

  setupReleasesTab(
    tabReleases,
    response.data,
    response.popup.imageSrc,
    response.popup.search,
    btnDownloadReleases
  );
}

function processDiscogsDraftPageResponse(response) {
  disable(btnCsvDataTab);
  hide(btnReleasesTab);
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

  btnReleaseTab.addEventListener('click', () => {
    hide(btnDownloadReleases, btnDownloadStorage);
    show(btnDownloadRelease);
    enable(btnCsvDataTab);
  });
  btnReleasesTab.addEventListener('click', () => {
    hide(btnDownloadRelease, btnDownloadStorage);
    show(btnDownloadReleases);
    disable(btnCsvDataTab);

    const releasesList = tabReleases.querySelector('releases-list');
    releasesList.refreshStatus();
  });
  btnHistoryTab.addEventListener('click', () => {
    hide(btnDownloadRelease, btnDownloadReleases);
    show(btnDownloadStorage);
    setupHistoryTab(document.getElementById('history'), btnDownloadStorage);
  });

  setupBandcampTab(btnHistoryTab);
}

function initialize(tab) {
  const currentTabUrl = tab.url;

  logInfo('Popup initialization');
  logInfo('Current URL', currentTabUrl);

  setupConsole();
  setupNavigation();
  replaceVersion(document);
  checkStorageSize();

  if (isValidBandcampURL(currentTabUrl)) {
    proceedBandcampData();
  } else if (isValidDiscogsReleaseEditUrl(currentTabUrl)) {
    proceedDiscogsEditPageData();
  } else {
    showBandcampTab();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTab().then((tab) => {
    initialize(tab);
  });
});

function checkStorageSize() {
  logInfo('Check storage size');

  getStorageSize((size) => {
    document.querySelectorAll('.storage-size').forEach((el) => {
      el.textContent = bytesToSize(size);
      el.setAttribute('title', `Storage size (${size} bytes)`);
    });
  });
}
