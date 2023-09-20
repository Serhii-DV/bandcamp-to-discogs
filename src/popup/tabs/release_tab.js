import { Release } from "../../app/release.js";
import { getSearchDiscogsReleaseUrl } from "../../discogs/discogs.js";
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
  btnDiscogsSearch.href = getSearchDiscogsReleaseUrl(release.artist, release.title);
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

  setBackgroundImage(document.querySelector('.bg-image'), release.coverSrc.big);
  releaseArtist.innerHTML = release.artist;
  releaseTitle.innerHTML = release.title;
  releaseDate.innerHTML = release.date.getFullYear();

  let countArtistLines = countLinesInHtmlElement(releaseArtist);
  let countTitleLines = countLinesInHtmlElement(releaseTitle);

  releaseArtist.classList.toggle('display-6', countArtistLines >= 3 && countArtistLines <= 5);
  tab.classList.add('lines-a' + countArtistLines + '-t' + countTitleLines);

  let trackinfo = '';

  release.tracks.forEach(track => {
    trackinfo += `${track.num}. ${track.title} (${track.durationText})<br>`;
  });

  releaseContent.innerHTML = trackinfo;
}

function countLinesInHtmlElement(el) {
  let divHeight = el.offsetHeight
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}
