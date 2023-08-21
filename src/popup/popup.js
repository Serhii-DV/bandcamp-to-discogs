import { objectToCsv, downloadCsv } from "../modules/csv.js";
import { generateSubmissionNotes, getSearchDiscogsReleaseUrl, releaseToDiscogsCsv } from "../discogs/discogs.js";
import { Release } from "../app/release.js";
import { getCurrentTab, getExtensionManifest, openTabs } from "../modules/chrome.js";
import { loadDiscogsGenres } from "../discogs/genres.js";
import { loadKeywordMapping } from "../bandcamp/mapping.js";
import config from "../config.js";
import { convertToAlias, createBootstrapCheckbox, createKeyValueDetails, hasClass, hide, loadHTMLContent, objectToDetailsElement, objectToHtmlElement, show } from "../modules/utils.js";

let release;
let tralbumData;
const btnCsvData = document.getElementById('csvData-tab');
const btnDownloadCsv = document.getElementById('download-csv');
const btnDiscogsSearch = document.getElementById('discogs-search-artist');
const btnAbout = document.getElementById('about-tab');
const elAbout = document.getElementById('about');
const elRelease = document.getElementById('release');
const releaseCover = document.getElementById('release-cover');
const releaseArtist = document.getElementById('release-artist');
const releaseTitle = document.getElementById('release-title');
const releaseDate = document.getElementById('release-year');
const releaseTracklist = document.getElementById('release-tracklist');
const elMainNav = document.getElementById('mainNav');
const elReleaseCard = document.querySelector('#releaseCard');
const elWarningMessage = document.getElementById('warningMessage');
const bandcampReleasesElement = document.getElementById('bandcampReleases');

btnCsvData.addEventListener('click', () => {
  const csvDataTabPane = document.getElementById('csvData');
  csvDataTabPane.innerHTML = '';

  const discogsCsv = releaseToDiscogsCsv(release);

  appendObjectData(discogsCsv.toCsvObject(), 'Discogs CSV data', csvDataTabPane);
  appendTextareaDetails('B2D Release JSON Data', discogsCsv.notes, csvDataTabPane);
  appendTextareaDetails('Submission notes', generateSubmissionNotes(release), csvDataTabPane);

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
    targetElement.querySelectorAll('.version').forEach(el => {
      el.textContent = manifest.version;
    });
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

function appendTextareaDetails(title, value, parentElement) {
  const textarea = document.createElement('textarea');
  textarea.classList.add('form-control');
  textarea.value = value;
  const detailsElement = createKeyValueDetails(title, textarea);
  detailsElement.open = true;

  parentElement.appendChild(detailsElement);
}

btnDownloadCsv.addEventListener('click', () => {
  const discogsCsv = releaseToDiscogsCsv(release);
  downloadCsv(
    objectToCsv(discogsCsv.toCsvObject()),
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

async function loadRelease() {
  getCurrentTab().then((tab) => {
    chrome.tabs.sendMessage(tab.id, { type: 'getBandcampData' }, (response) => {
      if (response === null || typeof response === 'undefined' || Object.keys(response).length === 0) {
        hideReleaseContent();
        hideMainNav();
        showWarningMessage();
        return;
      }

      if (response.type === 'release') {
        processBandcampReleaseData(response.data);
      } else if (response.type === 'list') {
        hide([elReleaseCard, elWarningMessage]);
        show(bandcampReleasesElement);
        processBandcampReleasesListData(response.data);
      }
    });
  });
}

function processBandcampReleaseData(data) {
  loadDiscogsGenres(config.genres_url).then(genres => {
    loadKeywordMapping(config.keyword_mapping_url).then(keywordsMapping => {
      tralbumData = data.tralbumData;

      setupRelease(
        tralbumData,
        data.bandData,
        data.schemaData,
        data.coverSrc
      );
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

function processBandcampReleasesListData(releases) {
  const releaseForm = document.getElementById("releasesForm");
  fillReleasesForm(releases, releaseForm)

  document.getElementById("submitBandcampReleases").addEventListener("click", async () => {
    const checkedCheckboxes = Array.from(releaseForm.querySelectorAll('input[type="checkbox"]:checked'));
    const checkedUrls = checkedCheckboxes.map((checkbox) => checkbox.value);

    await openTabs(checkedUrls, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractBandcampData
      });
    });
  });
}

function extractBandcampData() {
  // Implement your logic to extract data and save to local storage

  setTimeout(function() {
    window.close();
  }, 5000);
}

function fillReleasesForm(releases, form) {
  for (const release of releases) {
    const checkbox = createBootstrapCheckbox(
      convertToAlias(release.title),
      release.url,
      release.artist + " - " + release.title,
      true
    );

    form.querySelector('.checkboxes').appendChild(checkbox);
  }
}

loadRelease();
