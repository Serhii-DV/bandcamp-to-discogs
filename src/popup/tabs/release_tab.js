import { Release } from "../../app/release.js";
import { getSearchDiscogsReleaseUrl } from "../../discogs/discogs.js";
import { hide, show } from "../helpers.js";

let btnDiscogsSearch;
let elRelease;
let releaseCover;
let releaseArtist;
let releaseTitle;
let releaseDate;
let releaseTracklist;

/**
 * @param {Release} release
 */
export function setupReleaseTab(release) {
  btnDiscogsSearch = document.getElementById('discogs-search-artist');
  elRelease = document.getElementById('release');
  releaseCover = document.getElementById('release-cover');
  releaseArtist = document.getElementById('release-artist');
  releaseTitle = document.getElementById('release-title');
  releaseDate = document.getElementById('release-year');
  releaseTracklist = document.getElementById('release-tracklist');

  outputRelease(release);
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

function countLinesInHtmlElement(el) {
  let divHeight = el.offsetHeight
  let lineHeight = parseInt(getComputedStyle(el).lineHeight);
  return Math.round(divHeight / lineHeight);
}
