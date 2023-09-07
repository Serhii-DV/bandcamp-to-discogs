import { Release } from "../app/release.js";
import { getCurrentTab, getExtensionManifest } from "../modules/chrome.js";
import { loadDiscogsGenres } from "../discogs/genres.js";
import { loadKeywordMapping } from "../bandcamp/mapping.js";
import config from "../config.js";
import { setupStorage as setupStorageData } from "./tabs/storage_tab.js";
import { disable, hide, show, triggerClick } from "./helpers.js";
import { setupReleasesTab } from "./tabs/releases_tab.js";
import { setupBtnToDownloadReleasesAsCsv } from "./tabs/download_tab.js";
import { setupReleaseTab } from "./tabs/release_tab.js";
import { setupCsvDataTab } from "./tabs/csv_data_tab.js";

const btnReleaseTab = document.getElementById("release-tab");
const btnCsvDataTab = document.getElementById('csvData-tab');
const btnDownloadCsv = document.getElementById('download-csv');
const elMainNav = document.getElementById('mainNav');
const elReleaseCard = document.getElementById('releaseCard');
const elWarningMessage = document.getElementById('warningMessage');

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getBandcampData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0 || typeof response.data === 'undefined') {
        hide([elReleaseCard, elMainNav]);
        show(elWarningMessage);
        return;
      }

      processBandcampResponse(response);
    });
  });
}

function processBandcampResponse(response) {
  const isRelease = response.type === 'release';
  const isList = response.type === 'list';

  if (!isRelease && !isList) {
    // todo: Show error?
    return;
  }

  const elReleaseTabContent = document.getElementById('releaseTabContent');
  const elReleasesTabContent = document.getElementById('releasesTabContent');

  hide(elWarningMessage);
  triggerClick(btnReleaseTab);

  if (isRelease) {
    hide(elReleasesTabContent);
    show(elReleaseTabContent);

    processBandcampReleaseData(response.data);
  } else {
    hide(elReleaseTabContent);
    show(elReleasesTabContent);

    processBandcampReleasesListData(response);
  }
}

function processBandcampReleaseData(data) {
  loadDiscogsGenres(config.genres_url).then(genres => {
    loadKeywordMapping(config.keyword_mapping_url).then(keywordsMapping => {
      // Set global `release` value
      const release = Release.fromJSON(data);

      setupReleaseTab(release);
      setupCsvDataTab(release, keywordsMapping, btnCsvDataTab);
      setupBtnToDownloadReleasesAsCsv(btnDownloadCsv, [release]);

      show([elReleaseCard, elMainNav]);
      hide(elWarningMessage);
    });
  });
}

function processBandcampReleasesListData(response) {
  disable(btnDownloadCsv);
  setupReleasesTab(
    response.data,
    response.popup.imageSrc,
    btnDownloadCsv
  );
}

function replaceVersion() {
  const manifest = getExtensionManifest();

  // Set extension version
  document.querySelectorAll('.version').forEach(el => {
    el.textContent = manifest.version;
  });
}

function main() {
  loadRelease();
  setupStorageData(
    document.getElementById('storageDataForm'),
    document.getElementById('storageExport'),
    document.getElementById('storageDataClear')
  );

  replaceVersion();
}

document.addEventListener('DOMContentLoaded', main);
