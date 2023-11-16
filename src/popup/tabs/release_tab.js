import { Release } from "../../app/release.js";
import { getSearchDiscogsReleaseUrl } from "../../discogs/modules/discogs.js";
import { capitalizeEachWord, removeZeroHours } from "../../modules/utils.js";
import { setBackgroundImage } from "../helpers.js";
import { setupBtnToDownloadReleasesAsCsv } from "./download_tab.js";

/**
 * @param {Element} tab
 * @param {Release} release
 * @param {Element} btnDownloadRelease
 * @param {Element} btnDiscogsSearch
 */
export function setupReleaseTab(tab, release, btnDownloadRelease, btnDiscogsSearch) {
  outputRelease(tab, release);
  btnDiscogsSearch.href = getSearchDiscogsReleaseUrl(release.releaseItem.artist, release.releaseItem.title);
  setupBtnToDownloadReleasesAsCsv(btnDownloadRelease, [release]);
}

/**
 * @param {Element} tab
 * @param {Release} release
 */
function outputRelease(tab, release) {
  const releaseArtist = tab.querySelector('#release-artist');
  const releaseTitle = tab.querySelector('#release-title');
  const releaseDate = tab.querySelector('#release-year');
  const releaseContent = tab.querySelector('.release-content');

  setBackgroundImage(document.querySelector('.bg-image'), release.image);
  releaseArtist.innerHTML = release.releaseItem.artist;
  releaseTitle.innerHTML = release.releaseItem.title;
  releaseDate.innerHTML = release.date.getFullYear();

  let countArtistLines = countLinesInHtmlElement(releaseArtist);
  let countTitleLines = countLinesInHtmlElement(releaseTitle);

  releaseArtist.classList.toggle('display-6', countArtistLines >= 3 && countArtistLines <= 5);
  tab.classList.add('lines-a' + countArtistLines + '-t' + countTitleLines);

  let trackinfo = '';

  const tracks = release.tracks
    .map(track => `${track.num}. ${capitalizeEachWord(track.title)} (${removeZeroHours(track.duration)})`)
    .join("<br>");

  releaseContent.innerHTML = tracks;
}

function countLinesInHtmlElement(el) {
  let divHeight = el.offsetHeight
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}
