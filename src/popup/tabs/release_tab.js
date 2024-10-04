import { log } from '../../utils/console';
import { getSearchDiscogsReleaseUrl } from '../../discogs/modules/discogs.js';
import {
  capitalizeEachWord,
  getOwnProperty,
  removeLeadingZeroOrColon
} from '../../utils/utils';
import { setBackgroundImage } from '../helpers.js';
import { setupBtnToDownloadReleasesAsCsv } from './download_tab.js';
import { render } from '../../utils/render';
import { getHistoryByUuid } from '../../utils/storage';

/**
 * @param {Element} tab
 * @param {Release} release
 */
export function setupReleaseTab(tab, release) {
  log('Setup release tab data', release);

  if (release) {
    hideWarning();
  }

  getHistoryByUuid(release.uuid).then((historyData) => {
    renderReleaseCard(release, historyData, tab.querySelector('main'));
  });
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
 * @param {import('src/utils/storage.js').HistoryData} historyData
 * @param {Element} element
 */
function renderReleaseCard(release, historyData, element) {
  setBackgroundImage(document.querySelector('.bg-image'), release.image);

  const discogsSearchUrl = getSearchDiscogsReleaseUrl(
    release.artist,
    release.title
  );
  const tracks = release.tracks.map(
    (track) =>
      `${track.num}. ${capitalizeEachWord(track.title)} (${removeLeadingZeroOrColon(track.time.value)})`
  );
  const history = getOwnProperty(historyData, release.uuid, []);
  const releaseHistory = history
    .map((date) => ({
      localeString: date.toLocaleString(),
      isoString: date.toISOString()
    }))
    .reverse();

  render(document.getElementById('releaseCardTemplate'), element, {
    release,
    tracks,
    history: releaseHistory,
    discogsSearchUrl
  });

  setupBtnToDownloadReleasesAsCsv(
    element.querySelector('#downloadReleaseCsv'),
    [release]
  );

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
