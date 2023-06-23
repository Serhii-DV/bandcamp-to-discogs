import { objectToCsv, downloadCsv } from '../src/modules/csv.js';
import { objectToHtmlElement, releaseToCsvObject } from '../src/modules/discogs.js';
import { Release } from '../src/modules/release.js';
import { getCurrentTab } from '../src/modules/tab.js';

let release;
const previewDataBtn = document.getElementById('preview-data');
const modalPreviewData = document.getElementById('modal-preview-data');
const downloadCsvBtn = document.getElementById('download-csv');
const releaseEl = document.getElementById('release');
const releaseCover = document.getElementById('release-cover');
const releaseArtist = document.getElementById('release-artist');
const releaseTitle = document.getElementById('release-title');
const releaseDate = document.getElementById('release-year');
const releaseTracklist = document.getElementById('release-tracklist');
const message = document.getElementById('message');

previewDataBtn.addEventListener('click', () => {
  const discogsCsvTabPane = modalPreviewData.querySelector('#discogs-csv-tab-pane');
  const bandcampDataTabPane = modalPreviewData.querySelector('#bandcamp-data-tab-pane');

  const csvObject = releaseToCsvObject(release);
  const tableElement = objectToHtmlElement(csvObject);
  discogsCsvTabPane.appendChild(tableElement);

  const tableReleaseElement = objectToHtmlElement(release);
  bandcampDataTabPane.appendChild(tableReleaseElement);
});

downloadCsvBtn.addEventListener('click', () => {
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
  downloadCsvBtn.classList.add('disabled');
}

function enableButtons() {
  downloadCsvBtn.classList.remove('disabled');
}

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, {type:'getBandcampData'}, (response) => {

      if (response === undefined || Object.keys(response).length === 0) {
        hideRelease();
        disableButtons();
        showMessage();
        return;
      }

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
}

loadRelease();
