import { Release } from "../app/release.js";
import { getCurrentTab, getExtensionManifest } from "../modules/chrome.js";
import { loadDiscogsGenres } from "../discogs/genres.js";
import { loadKeywordMapping } from "../bandcamp/mapping.js";
import config from "../config.js";
import { setupStorageTab } from "./tabs/storage_tab.js";
import { hide, show, triggerClick } from "./helpers.js";
import { setupReleasesTab } from "./tabs/releases_tab.js";
import { setupBtnToDownloadReleasesAsCsv } from "./tabs/download_tab.js";
import { setupReleaseTab } from "./tabs/release_tab.js";
import { setupCsvDataTab } from "./tabs/csv_data_tab.js";

const btnReleaseTab = document.getElementById("release-tab");
const btnReleasesTab = document.getElementById("releases-tab");
const btnCsvDataTab = document.getElementById('csvData-tab');
const btnStorageTab = document.getElementById('storageData-tab');
const btnDownloadRelease = document.getElementById('downloadRelease');
const btnDownloadReleases = document.getElementById('downloadReleases');
const btnDownloadStorage = document.getElementById('downloadStorage');
const elMainNav = document.getElementById('mainNav');
const elMainContainer = document.getElementById('mainContainer');
const elWarningMessage = document.getElementById('warningMessage');

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getBandcampData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0 || typeof response.data === 'undefined') {
        hide([elMainNav]);
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

  hide(elWarningMessage);

  if (isRelease) {
    processBandcampReleaseData(response.data);
  } else {
    processBandcampReleasesData(response);
  }
}

function processBandcampReleaseData(data) {
  hide(btnReleasesTab);
  show(btnReleaseTab);
  triggerClick(btnReleaseTab);

  loadDiscogsGenres(config.genres_url).then(genres => {
    loadKeywordMapping(config.keyword_mapping_url).then(keywordsMapping => {
      // Set global `release` value
      const release = Release.fromJSON(data);

      setupReleaseTab(release);
      setupCsvDataTab(release, keywordsMapping, btnCsvDataTab);
      setupBtnToDownloadReleasesAsCsv(btnDownloadRelease, [release]);

      show([elMainNav]);
      hide(elWarningMessage);
    });
  });
}

function processBandcampReleasesData(response) {
  hide(btnReleaseTab);
  show(btnReleasesTab);
  triggerClick(btnReleasesTab);

  setupReleasesTab(
    response.data,
    response.popup.imageSrc,
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
  });
  btnReleasesTab.addEventListener('click', () => {
    hide(btnDownloadRelease, btnDownloadStorage);
    show(btnDownloadReleases);
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
  loadRelease();
  replaceVersion();
}

document.addEventListener('DOMContentLoaded', main);
