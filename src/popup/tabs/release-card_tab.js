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
import { toggleElements } from '../../utils/html';
import { Release } from '../../app/release.js';
import { getReleaseCardContentElement } from '../modules/main';

/**
 * @param {Release} release
 */
export function setupReleaseCardTab(release) {
  log('Setup release card tab', release);

  const contentElement = getReleaseCardContentElement();
  const isRelease = release instanceof Release;

  toggleElements(!isRelease, getWarningElement(contentElement));

  if (isRelease) {
    getHistoryByUuid(release.uuid).then((historyData) => {
      renderReleaseCard(
        release,
        historyData,
        contentElement.querySelector('main')
      );
    });
  }
}

function getWarningElement(tab) {
  return tab.querySelector('.b2d-warning');
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
  const releaseHistory = history.map((date) => dateToTemplate(date)).reverse();
  const published = dateToTemplate(release.published);
  const modified = dateToTemplate(release.modified);

  render(document.getElementById('releaseCardTemplate'), element, {
    release,
    tracks,
    history: releaseHistory,
    modified,
    published,
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

function dateToTemplate(date) {
  return {
    localeString: date.toLocaleString(),
    isoString: date.toISOString()
  };
}
