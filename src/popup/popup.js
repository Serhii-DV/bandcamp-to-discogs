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

let release;
let tralbumData;
const btnReleaseTab = document.getElementById("release-tab");
const btnReleasesTab = document.getElementById("releases-tab");
const btnCsvData = document.getElementById('csvData-tab');
const btnDownloadCsv = document.getElementById('download-csv');
const elMainNav = document.getElementById('mainNav');
const elReleaseCard = document.querySelector('#releaseCard');
const elWarningMessage = document.getElementById('warningMessage');

btnCsvData.addEventListener('click', () => {
  const csvDataTabPane = document.getElementById('csvData');
  csvDataTabPane.innerHTML = '';

  if (release instanceof Release) {
    const discogsCsv = releaseToDiscogsCsv(release);

    appendObjectData(discogsCsv.toCsvObject(), 'Discogs CSV data', csvDataTabPane);
    appendTextareaDetails('B2D Release JSON Data', discogsCsv.notes, csvDataTabPane);
    appendTextareaDetails('Submission notes', generateSubmissionNotes(release), csvDataTabPane);

    csvDataTabPane.appendChild(objectToDetailsElement(release, 'Generated release data'));
    csvDataTabPane.appendChild(objectToDetailsElement(tralbumData, 'Bandcamp TralbumData object'));
  }
});

function appendObjectData(obj, headline, el) {
  const headlineEl = document.createElement('h2');
  headlineEl.classList.add('display-6');
  headlineEl.innerText = headline;
  el.appendChild(headlineEl);
  el.appendChild(objectToHtmlElement(obj));
}

function appendTextareaDetails(title, value, parentElement) {
  const textarea = document.createElement('textarea');
  textarea.classList.add('form-control');
  textarea.value = value;
  const detailsElement = createKeyValueDetails(title, textarea);
  detailsElement.open = true;

  parentElement.appendChild(detailsElement);
}

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
