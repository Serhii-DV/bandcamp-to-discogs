import { objectToCsv, downloadCsv } from "../modules/csv.js";
import { getSearchDiscogsReleaseUrl, objectToHtmlElement, releaseToCsvObject } from "../discogs/discogs.js";
import { Release } from "../app/release.js";
import { getCurrentTab } from "../modules/tab.js";
import { loadDiscogsGenres } from "../discogs/genres.js";

let release;
const btnCsvData = document.getElementById('csvData-tab');
const btnBandcampData = document.getElementById('bandcampData-tab');
const btnDownloadCsv = document.getElementById('download-csv');
const btnDiscogsSearch = document.getElementById('discogs-search-artist');
const btnsDisableEnable = [
  btnCsvData,
  btnDownloadCsv,
  btnDiscogsSearch,
  btnBandcampData
];
const releaseEl = document.getElementById('release');
const releaseCover = document.getElementById('release-cover');
const releaseArtist = document.getElementById('release-artist');
const releaseTitle = document.getElementById('release-title');
const releaseDate = document.getElementById('release-year');
const releaseTracklist = document.getElementById('release-tracklist');
const message = document.getElementById('message');

btnCsvData.addEventListener('click', () => {
  const discogsCsvTabPane = document.querySelector('#csvData .content');
  const csvObject = releaseToCsvObject(release);
  const tableEl = objectToHtmlElement(csvObject);
  discogsCsvTabPane.textContent = '';
  discogsCsvTabPane.appendChild(tableEl);
});

btnBandcampData.addEventListener('click', () => {
  const bandcampDataTabPane = document.querySelector('#bandcampData .content');
  const tableEl = objectToHtmlElement(release);
  bandcampDataTabPane.textContent = '';
  bandcampDataTabPane.appendChild(tableEl);
});

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
  releaseEl.classList.add('lines-a' + countArtistLines + '-t' + countTitleLines);

  let trackinfo = '';

  release.tracks.forEach(track => {
    trackinfo += `${track.num}. ${track.title} (${track.durationText})<br>`;
  });

  releaseTracklist.innerHTML = trackinfo;
  btnDiscogsSearch.href = getSearchDiscogsReleaseUrl(release.artist, release.title);
}

function hideRelease() {
  releaseEl.classList.add('visually-hidden');
}

function showRelease() {
  releaseEl.classList.remove('visually-hidden');
}

function showMessage() {
  message.classList.remove('visually-hidden');
}

function hideMessage() {
  message.classList.add('visually-hidden');
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
        hideRelease();
        disableButtons();
        showMessage();
        return;
      }

      loadDiscogsGenres().then(genres => {
        release = Release.fromBandcampData(
          response.tralbumData,
          response.bandData,
          response.schemaData,
          response.coverSrc
        );

        outputRelease(release);
        showRelease();
        enableButtons();
        hideMessage();
      });
    });
  });
}

loadRelease();
