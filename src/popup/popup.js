import { Release } from "../app/release.js";
import { getCurrentTab, getExtensionManifest } from "../modules/chrome.js";
import { loadDiscogsGenres } from "../discogs/modules/genres.js";
import { loadKeywordMapping } from "../bandcamp/modules/mapping.js";
import config from "../config.js";
import { setHistoryTabSearchValue, setupHistoryTab } from "./tabs/history_tab.js";
import { disable, enable, hide, show, click } from "../modules/html.js";
import { setupReleasesTab } from "./tabs/releases_tab.js";
import { setupReleaseTab } from "./tabs/release_tab.js";
import { setupCsvDataTab } from "./tabs/csv_data_tab.js";
import { getStorageSize } from "../modules/storage.js";
import { bytesToSize } from "../modules/utils.js";
import { setupConsole, setupConsoleRelease } from "./console.js";
import { isValidBandcampURL } from "../bandcamp/modules/html.js";
import { isValidDiscogsReleaseEditUrl } from "../discogs/app/utils.js";
import { logInfo } from "../utils/console.js";

const btnDashboardTab = document.getElementById("dashboard-tab");
const btnReleaseTab = document.getElementById("release-tab");
const btnReleasesTab = document.getElementById("releases-tab");
const btnCsvDataTab = document.getElementById('csvData-tab');
const btnHistoryTab = document.getElementById('history-tab');
const btnDownloadRelease = document.getElementById('downloadRelease');
const btnDownloadReleases = document.getElementById('downloadReleases');
const btnDownloadStorage = document.getElementById('downloadHistory');
const btnDiscogsSearchArtist = document.getElementById('discogsSearchArtist');
const tabReleases = document.getElementById('releases');

async function proceedBandcampData() {
  logInfo('Proceed bandcamp data');

  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getBandcampData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0 || typeof response.data === 'undefined') {
        showBandcampDataNotFoundWarning();
        return;
      }

      processBandcampResponse(response);
    });
  });
}

async function proceedDiscogsEditPageData() {
  logInfo('Proceed discogs edit page data');

  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getDiscogsEditPageData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0 || typeof response.data === 'undefined') {
        return;
      }

      processDiscogsDraftPageResponse(response);
    });
  });
}

function showBandcampDataNotFoundWarning() {
  showDashboard();

  // Wait for dashboard content load
  const interval = 100;
  setInterval(() => {
    const warningBandcampDataNotFound = document.getElementById('b2d-warning-bandcamp-data-not-found');

    if (warningBandcampDataNotFound) {
      show(warningBandcampDataNotFound);
      clearInterval(interval);
    }
  }, interval);
}

function showDashboard() {
  disable(btnReleaseTab, btnCsvDataTab);
  hide(btnReleasesTab);
  show(btnDownloadReleases);
  click(btnDashboardTab);
}

function processBandcampResponse(response) {
  const isRelease = response.type === 'release';
  const isList = response.type === 'list';

  if (!isRelease && !isList) {
    // todo: Show error?
    return;
  }

  loadDiscogsGenres(config.genres_url).then(genres => {
    loadKeywordMapping(config.keyword_mapping_url).then(keywordsMapping => {
      if (isRelease) {
        processBandcampReleaseData(response.data, keywordsMapping);
      } else {
        processBandcampReleasesData(response);
      }
    })
  });
}

function processBandcampReleaseData(data, keywordsMapping) {
  hide(btnReleasesTab);
  show(btnReleaseTab);
  click(btnReleaseTab);

  try {
    const release = Release.fromStorageObject(data);
    setupConsoleRelease(release, keywordsMapping);
    setupReleaseTab(
      document.getElementById('release'),
      release,
      btnDownloadRelease,
      btnDiscogsSearchArtist
    );
    setupCsvDataTab(release, btnCsvDataTab);
  } catch (error) {
    console.error(error);
  }
}

function processBandcampReleasesData(response) {
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
  disable(btnReleaseTab, btnCsvDataTab);
  hide(btnReleasesTab);
  click(btnHistoryTab);
  setHistoryTabSearchValue(response.data.artistName);
}

function replaceVersion(document) {
  logInfo('Replace extension version');
  const manifest = getExtensionManifest();

  // Set extension version
  document.querySelectorAll('.version').forEach(el => {
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
    setupHistoryTab(
      document.getElementById('history'),
      btnDownloadStorage
    );
  });
}

function initialize(tab) {
  const currentTabUrl = tab.url;

  logInfo('Popup initialization');
  logInfo('Current URL', currentTabUrl);

  setupConsole();
  setupNavigation();
  replaceVersion(document);
  checkStorageSize();
  onExternalContentLoaded((e) => {
    replaceVersion(e.target);
  });

  if (isValidBandcampURL(currentTabUrl)) {
    proceedBandcampData();
  } else if (isValidDiscogsReleaseEditUrl(currentTabUrl)) {
    proceedDiscogsEditPageData();
  } else {
    showBandcampDataNotFoundWarning();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTab().then((tab) => {
    initialize(tab);
  });
});

function checkStorageSize() {
  logInfo('Check storage size');

  getStorageSize(size => {
    document.querySelectorAll('.storage-size').forEach(el => {
      el.textContent = bytesToSize(size);
      el.setAttribute('title', `Storage size (${size} bytes)`)
    });
  });
}

/**
 * Run some specific logic for external content
 */
function onExternalContentLoaded(fn) {
  const externalContentElements = document.querySelectorAll('external-content');
  externalContentElements.forEach(el => {
    el.addEventListener('externalContentLoaded', fn);
  });
}
