import { Release } from "../app/release.js";
import { getCurrentTab, getExtensionManifest } from "../modules/chrome.js";
import { loadDiscogsGenres } from "../discogs/genres.js";
import { loadKeywordMapping } from "../bandcamp/modules/mapping.js";
import config from "../config.js";
import { setupStorageTab } from "./tabs/storage_tab.js";
import { disable, enable, hide, show, click } from "../modules/html.js";
import { setupReleasesTab } from "./tabs/releases_tab.js";
import { setupReleaseTab } from "./tabs/release_tab.js";
import { setupCsvDataTab } from "./tabs/csv_data_tab.js";

const btnWarningMessageTab = document.getElementById("warningMessage-tab");
const btnReleaseTab = document.getElementById("release-tab");
const btnReleasesTab = document.getElementById("releases-tab");
const btnCsvDataTab = document.getElementById('csvData-tab');
const btnStorageTab = document.getElementById('storageData-tab');
const btnDownloadRelease = document.getElementById('downloadRelease');
const btnDownloadReleases = document.getElementById('downloadReleases');
const btnDownloadStorage = document.getElementById('downloadStorage');
const btnDiscogsSearchArtist = document.getElementById('discogsSearchArtist');
const tabReleases = document.getElementById('releases');

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getBandcampData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0 || typeof response.data === 'undefined') {
        showWarningMessage();
        return;
      }

      processBandcampResponse(response);
    });
  });
}

function showWarningMessage() {
  disable(btnReleaseTab, btnCsvDataTab);
  hide(btnReleasesTab);
  show(btnWarningMessageTab, btnDownloadReleases);
  click(btnWarningMessageTab);
}

function processBandcampResponse(response) {
  const isRelease = response.type === 'release';
  const isList = response.type === 'list';

  if (!isRelease && !isList) {
    // todo: Show error?
    return;
  }

  hide(btnWarningMessageTab);

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

  const release = Release.fromObject(data);
  setupReleaseTab(
    document.getElementById('release'),
    release,
    btnDownloadRelease,
    btnDiscogsSearchArtist
  );
  setupCsvDataTab(release, keywordsMapping, btnCsvDataTab);
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

function replaceVersion() {
  const manifest = getExtensionManifest();

  // Set extension version
  document.querySelectorAll('.version').forEach(el => {
    el.textContent = manifest.version;
  });
}

function setupNavigation() {
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
  btnStorageTab.addEventListener('click', () => {
    hide(btnDownloadRelease, btnDownloadReleases);
    show(btnDownloadStorage);
    setupStorageTab(
      document.getElementById('storageData'),
      btnDownloadStorage
    );
  });
}

function main() {
  setupNavigation();
  replaceVersion();
  loadRelease();
}

document.addEventListener('DOMContentLoaded', main);
