import { generateSubmissionNotes, releaseToDiscogsCsv } from "../discogs/discogs.js";
import { Release } from "../app/release.js";
import { getCurrentTab, getExtensionManifest, openTabs } from "../modules/chrome.js";
import { loadDiscogsGenres } from "../discogs/genres.js";
import { loadKeywordMapping } from "../bandcamp/mapping.js";
import config from "../config.js";
import { createKeyValueDetails, disable, hasClass, hide, loadHTMLContent, objectToDetailsElement, objectToHtmlElement, show } from "../modules/utils.js";
import { setupStorage as setupStorageData } from "./tabs/storage_tab.js";
import { triggerClick } from "./helpers.js";
import { setupReleasesTab } from "./tabs/releases_tab.js";
import { setupDownloadReleasesAsCsv } from "./tabs/download_tab.js";
import { setupReleaseTab } from "./tabs/release_tab.js";
import { setupCsvDataTab } from "./tabs/csv_data_tab.js";

let release;
const btnReleaseTab = document.getElementById("release-tab");
const btnCsvDataTab = document.getElementById('csvData-tab');
const btnReleasesTab = document.getElementById("releases-tab");
const btnDownloadCsv = document.getElementById('download-csv');
const elMainNav = document.getElementById('mainNav');
const elReleaseCard = document.querySelector('#releaseCard');
const elWarningMessage = document.getElementById('warningMessage');

function showReleaseContent() {
  elReleaseCard.classList.remove('visually-hidden');
}

function showWarningMessage() {
  hide([elReleaseCard, elMainNav]);
  show(elWarningMessage);
}

function hideWarningMessage() {
  elWarningMessage.classList.add('visually-hidden');
}

function showMainNav() {
  elMainNav.classList.remove('visually-hidden');
}

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getBandcampData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0 || typeof response.data === 'undefined') {
        showWarningMessage();
        return;
      }

      if (response.type === 'release') {
        processBandcampReleaseData(response.data);
      } else if (response.type === 'list') {
        processBandcampReleasesListData(response.data);
      }
    });
  });
}

function processBandcampReleaseData(data) {
  triggerClick(btnReleaseTab);
  disable(btnReleasesTab);

  loadDiscogsGenres(config.genres_url).then(genres => {
    loadKeywordMapping(config.keyword_mapping_url).then(keywordsMapping => {
      // Set global `release` value
      release = Release.fromJSON(data);

      setupReleaseTab(release);
      setupCsvDataTab(release, btnCsvDataTab);
      setupDownloadReleasesAsCsv(btnDownloadCsv, [release]);
      showReleaseContent();
      showMainNav();
      hideWarningMessage();
    });
  });
}

function processBandcampReleasesListData(releasesList) {
  hide(elWarningMessage);
  triggerClick(btnReleasesTab);
  disable([btnReleaseTab, btnDownloadCsv]);

  // releaseCover.src =
  setupReleasesTab(
    releasesList,
    document.getElementById("releasesForm"),
    document.getElementById("submitBandcampReleases"),
    btnDownloadCsv
  );
}

function main() {
  loadRelease();
  setupStorageData(
    document.getElementById('storageDataForm'),
    document.getElementById('storageExport'),
    document.getElementById('storageDataClear')
  );

  const manifest = getExtensionManifest();

  // Set extension version
  document.querySelectorAll('.version').forEach(el => {
    el.textContent = manifest.version;
  });
}

document.addEventListener('DOMContentLoaded', main);
