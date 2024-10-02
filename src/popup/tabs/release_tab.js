import { log } from '../../utils/console';
import { getSearchDiscogsReleaseUrl } from '../../discogs/modules/discogs.js';
import {
  capitalizeEachWord,
  removeLeadingZeroOrColon
} from '../../utils/utils';
import { setBackgroundImage } from '../helpers.js';
import { setupBtnToDownloadReleasesAsCsv } from './download_tab.js';
import { createElementFromHTML } from '../../utils/html';

/**
 * @param {Element} tab
 * @param {Release} release
 * @param {Element} btnDownloadRelease
 * @param {Element} btnDiscogsSearch
 */
export function setupReleaseTab(
  tab,
  release,
  btnDownloadRelease,
  btnDiscogsSearch
) {
  log('Setup release tab data', release);

  if (release) {
    hideWarning();
  }

  outputRelease(tab, release);
  btnDiscogsSearch.href = getSearchDiscogsReleaseUrl(
    release.releaseItem.artist,
    release.releaseItem.title
  );
  setupBtnToDownloadReleasesAsCsv(btnDownloadRelease, [release]);
}

function hideWarning() {
  const warningEl = document.getElementById('b2d-warning-no-data');
  warningEl.classList.add('visually-hidden');
}

/**
 * @param {Element} tab
 * @param {Release} release
 */
function outputRelease(tab, release) {
  const mainElement = addReleaseCardToElement(
    release,
    tab.querySelector('main')
  );
  const releaseArtist = mainElement.querySelector('#release-artist');
  const releaseTitle = mainElement.querySelector('#release-title');

  setBackgroundImage(document.querySelector('.bg-image'), release.image);

  let countArtistLines = countLinesInHtmlElement(releaseArtist);
  let countTitleLines = countLinesInHtmlElement(releaseTitle);

  releaseArtist.classList.toggle(
    'display-6',
    countArtistLines >= 3 && countArtistLines <= 5
  );
  mainElement.classList.add(
    'lines-a' + countArtistLines + '-t' + countTitleLines
  );
}

function countLinesInHtmlElement(el) {
  let divHeight = el.offsetHeight;
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}

/**
 * @param {Release} release
 * @param {Element} element
 * @returns {Element}
 */
function addReleaseCardToElement(release, element) {
  const tracks = release.tracks
    .map(
      (track) =>
        `${track.num}. ${capitalizeEachWord(track.title)} (${removeLeadingZeroOrColon(track.time.value)})`
    )
    .join('<br>');

  const releaseHeadline = createElementFromHTML(`
<div class="release-headline">
  <h1 id="release-artist" class="display-3">${release.artist}</h1>
  <h2 id="release-title" class="display-6">${release.title}</h2>
  <h3 id="release-year" class="display-6">${release.year}</h3>
  <div><a href="${release.url}" title="Open Bandcamp release page\n${release.url}" target="_blank">Bandcamp</a></div>
</div>`);

  const releaseContent = createElementFromHTML(`
<div class="release-content small overflow-auto">
  <div id="release-tracks">${tracks}</div>
</div>`);

  element.innerHTML = '';
  element.appendChild(releaseHeadline).appendChild(releaseContent);

  return element;
}
