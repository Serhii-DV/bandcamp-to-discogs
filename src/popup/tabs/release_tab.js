import { log } from '../../utils/console';
import { getSearchDiscogsReleaseUrl } from '../../discogs/modules/discogs.js';
import {
  capitalizeEachWord,
  removeLeadingZeroOrColon
} from '../../utils/utils';
import { setBackgroundImage } from '../helpers.js';
import { setupBtnToDownloadReleasesAsCsv } from './download_tab.js';

/**
 * @param {Element} tab
 * @param {Release} release
 * @param {Element} btnDownloadRelease
 */
export function setupReleaseTab(tab, release, btnDownloadRelease) {
  log('Setup release tab data', release);

  if (release) {
    hideWarning();
  }

  renderReleaseCard(release, tab.querySelector('main'));
  setupBtnToDownloadReleasesAsCsv(btnDownloadRelease, [release]);
}

function hideWarning() {
  const warningEl = document.getElementById('b2d-warning-no-data');
  warningEl.classList.add('visually-hidden');
}

function countLinesInHtmlElement(el) {
  let divHeight = el.offsetHeight;
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}

/**
 * @param {Release} release
 * @param {Element} element
 */
function renderReleaseCard(release, element) {
  setBackgroundImage(document.querySelector('.bg-image'), release.image);

  const discogsSearchUrl = getSearchDiscogsReleaseUrl(
    release.artist,
    release.title
  );
  const tracks = release.tracks
    .map(
      (track) =>
        `${track.num}. ${capitalizeEachWord(track.title)} (${removeLeadingZeroOrColon(track.time.value)})`
    )
    .join('<br>');

  const template = `
<div class="release-headline">
  <h1 id="release-artist" class="display-3">${release.artist}</h1>
  <h2 id="release-title" class="display-6">${release.title}</h2>
  <h3 id="release-year" class="display-6">${release.year}</h3>
</div>
<div class="release-content small overflow-auto">
  <ul class="nav nav-pills" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="rc-tracks-tab" data-bs-toggle="pill" data-bs-target="#release-tracks" type="button" role="tab" aria-controls="release-tracks" aria-selected="true">Tracklist</button>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${release.url}" title="Open Bandcamp release page\n${release.url}" target="_blank">Bandcamp</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="${discogsSearchUrl}" title="Search release on Discogs" target="_blank">Search on Discogs</a>
    </li>
  </ul>
  <div class="tab-content">
    <div class="tab-pane fade show active" id="release-tracks" role="tabpanel" aria-labelledby="rc-tracks-tab" tabindex="0">${tracks}</div>
  </div>
</div>`;

  element.innerHTML = template;

  const releaseArtist = element.querySelector('#release-artist');
  const releaseTitle = element.querySelector('#release-title');
  const countArtistLines = countLinesInHtmlElement(releaseArtist);
  const countTitleLines = countLinesInHtmlElement(releaseTitle);

  releaseArtist.classList.toggle(
    'display-6',
    countArtistLines >= 3 && countArtistLines <= 5
  );
  element.classList = 'lines-a' + countArtistLines + '-t' + countTitleLines;
}
