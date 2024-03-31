import { Release } from "../../app/release.js";
import { getSearchDiscogsReleaseUrl } from "../../discogs/modules/discogs.js";
import { capitalizeEachWord, removeLeadingZeroOrColon } from "../../modules/utils.js";
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
  const releaseTracks = tab.querySelector('#release-tracks');

  setBackgroundImage(document.querySelector('.bg-image'), release.image);
  releaseArtist.innerHTML = release.releaseItem.artist;
  releaseTitle.innerHTML = release.releaseItem.title;
  releaseDate.innerHTML = release.published.getFullYear();

  let countArtistLines = countLinesInHtmlElement(releaseArtist);
  let countTitleLines = countLinesInHtmlElement(releaseTitle);

  releaseArtist.classList.toggle('display-6', countArtistLines >= 3 && countArtistLines <= 5);
  tab.classList.add('lines-a' + countArtistLines + '-t' + countTitleLines);

  const tracks = release.tracks
    .map(track => `${track.num}. ${capitalizeEachWord(track.title)} (${removeLeadingZeroOrColon(track.duration.value)})`)
    .join("<br>");

  releaseTracks.innerHTML = tracks;
  releaseContent.querySelectorAll('.js-releasePublishedDate').forEach(el => el.innerHTML = release.publishedDate());
  releaseContent.querySelectorAll('.js-releaseModifiedDate').forEach(el => el.innerHTML = release.modifiedDate());
}

function countLinesInHtmlElement(el) {
  let divHeight = el.offsetHeight
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}
