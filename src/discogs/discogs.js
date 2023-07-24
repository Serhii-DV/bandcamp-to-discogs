import { DiscogsCsv } from "./discogs-csv.js";
import { Release } from "../app/release.js";

/**
 * @param {Release} release
 * @returns {Object}
 */
export function releaseToCsvObject(release) {
  return DiscogsCsv.fromRelease(release).toCsvObject();
}

export function getSearchDiscogsArtistUrl(artist) {
  return `https://www.discogs.com/search?q=${encodeURIComponent(artist)}&type=artist`;
}

export function getSearchDiscogsReleaseUrl(artist, release) {
  return `https://www.discogs.com/search?q=${encodeURIComponent(artist)}+${encodeURIComponent(release)}&type=release`;
}

/**
 * @param {Release} release
 * @returns {String}
 */
export function generateSubmissionNotes(release) {
  return `This draft was created via CSV upload and Bandcamp To Discogs Google Chrome extension (https://chrome.google.com/webstore/detail/bandcamp-to-discogs-b2d/hipnkehalkffbdjnbbeoefmoondaciok).\n\nRelease url: ${release.url}`;
}
