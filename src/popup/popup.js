import { objectToCsv, downloadCsv } from "../modules/csv.js";
import { generateSubmissionNotes, getSearchDiscogsReleaseUrl, releaseToCsvObject } from "../discogs/discogs.js";
import { Release } from "../app/release.js";
import { getCurrentTab, getExtensionManifest } from "../modules/chrome.js";
import { loadDiscogsGenres } from "../discogs/genres.js";
import { loadKeywordMapping } from "../bandcamp/mapping.js";
import config from "../config.js";
import { createKeyValueDetails, hasClass, loadHTMLContent, objectToDetailsElement, objectToHtmlElement } from "../modules/utils.js";

let release;
let tralbumData;
const btnCsvData = document.getElementById('csvData-tab');
const btnDownloadCsv = document.getElementById('download-csv');
const btnDiscogsSearch = document.getElementById('discogs-search-artist');
const btnAbout = document.getElementById('about-tab');
const elAbout = document.getElementById('about');
const btnsDisableEnable = [
  btnCsvData,
  btnDownloadCsv,
  btnDiscogsSearch
];
const elRelease = document.getElementById('release');
const releaseCover = document.getElementById('release-cover');
const releaseArtist = document.getElementById('release-artist');
const releaseTitle = document.getElementById('release-title');
const releaseDate = document.getElementById('release-year');
const releaseTracklist = document.getElementById('release-tracklist');
const elMainNav = document.getElementById('mainNav');
const elReleaseCard = document.querySelector('#releaseCard');
const elWarningMessage = document.getElementById('warningMessage');

btnCsvData.addEventListener('click', () => {
  const csvDataTabPane = document.getElementById('csvData');
  csvDataTabPane.innerHTML = '';

  appendObjectData(releaseToCsvObject(release), 'Discogs CSV data', csvDataTabPane);
  appendSubmissionNotesDetails(release, csvDataTabPane);

  csvDataTabPane.appendChild(objectToDetailsElement(release, 'Generated release data'));
  csvDataTabPane.appendChild(objectToDetailsElement(tralbumData, 'Bandcamp TralbumData object'));
});

/**
 * Output about tab pane
 */
btnAbout.addEventListener('click', () => {
  if (hasClass(elAbout, 'loaded')) return;
  const promise = loadHTMLContent(config.about_url, elAbout);
  promise.then(targetElement => {
    const manifest = getExtensionManifest();
    targetElement.querySelector('.version').textContent = manifest.version;
  })
  .then(() => {
    elAbout.classList.add('loaded');
  });
});

function appendObjectData(obj, headline, el) {
  const headlineEl = document.createElement('h2');
  headlineEl.classList.add('display-6');
  headlineEl.innerText = headline;
  el.appendChild(headlineEl);
  el.appendChild(objectToHtmlElement(obj));
}

function appendSubmissionNotesDetails(release, parentElement) {
  const submissionNotesTextareaElement = document.createElement('textarea');
  submissionNotesTextareaElement.classList.add('form-control');
  submissionNotesTextareaElement.value = generateSubmissionNotes(release);

  const detailsElement = createKeyValueDetails('Submission notes', submissionNotesTextareaElement);
  detailsElement.open = true;

  parentElement.appendChild(detailsElement);
}

btnDownloadCsv.addEventListener('click', () => {
  let csvObject = releaseToCsvObject(release);
  downloadCsv(
    objectToCsv(csvObject),
    `discogs-${release.artist}-${release.title}`
  );
});

function countLinesInHtmlElement(el) {
  let divHeight = el.offsetHeight
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}

/**
 * @param {Release} release
 */
function outputRelease(release) {
  releaseCover.src = release.coverSrc.big;
  releaseArtist.innerHTML = release.artist;
  releaseTitle.innerHTML = release.title;
  releaseDate.innerHTML = release.date.getFullYear();

  let countArtistLines = countLinesInHtmlElement(releaseArtist);
  let countTitleLines = countLinesInHtmlElement(releaseTitle);

  releaseArtist.classList.toggle('display-6', countArtistLines >= 3 && countArtistLines <= 5);
  elRelease.classList.add('lines-a' + countArtistLines + '-t' + countTitleLines);

  let trackinfo = '';

  release.tracks.forEach(track => {
    trackinfo += `${track.num}. ${track.title} (${track.durationText})<br>`;
  });

  releaseTracklist.innerHTML = trackinfo;
  btnDiscogsSearch.href = getSearchDiscogsReleaseUrl(release.artist, release.title);
}

function hideReleaseContent() {
  elReleaseCard.classList.add('visually-hidden');
}

function showReleaseContent() {
  elReleaseCard.classList.remove('visually-hidden');
}

function showWarningMessage() {
  elWarningMessage.classList.remove('visually-hidden');
}

function hideWarningMessage() {
  elWarningMessage.classList.add('visually-hidden');
}

function showMainNav() {
  elMainNav.classList.remove('visually-hidden');
}

function hideMainNav() {
  elMainNav.classList.add('visually-hidden');
}

function disableButtons() {
  btnsDisableEnable.forEach(button => button.classList.add('disabled'));
}

function enableButtons() {
  btnsDisableEnable.forEach(button => button.classList.remove('disabled'));
}

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getBandcampData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0) {
        hideReleaseContent();
        hideMainNav();
        showWarningMessage();
        return;
      }

      loadDiscogsGenres(config.genres_url).then(genres => {
        loadKeywordMapping(config.keyword_mapping_url).then(keywordsMapping => {
          tralbumData = response.tralbumData;

          setupRelease(
            tralbumData,
            response.bandData,
            response.schemaData,
            response.coverSrc
          );
        });
      });
    });
  });
}

function setupRelease(tralbumData, bandData, schemaData, coverSrc) {
  release = Release.fromBandcampData(
    tralbumData,
    bandData,
    schemaData,
    coverSrc
  );

  outputRelease(release);
  showReleaseContent();
  showMainNav();
  hideWarningMessage();
}

loadRelease();
