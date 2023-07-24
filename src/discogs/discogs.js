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
