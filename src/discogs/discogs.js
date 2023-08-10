import { DiscogsCsv } from "./discogs-csv.js";
import { Release } from "../app/release.js";
import config from "../config.js";
import { replaceTokens } from "../modules/utils.js";

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
  return replaceTokens(config.text.notes, {
    extension_url: config.extension_url,
    release_url: release.url
  });
}
