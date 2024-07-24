import { DiscogsCsv } from "../app/discogs-csv.js";
import { Release } from "../../app/release.js";
import config from "../../config.js";
import { replaceTokens } from "../../modules/utils.js";

/**
 * @param {Release} release
 * @returns {DiscogsCsv}
 */
export function releaseToDiscogsCsv(release) {
  return DiscogsCsv.fromRelease(release);
}

export function getSearchDiscogsArtistUrl(artist) {
  return replaceTokens(config.discogs_search_artist_url, {artist: artist});
}

export function getSearchDiscogsReleaseUrl(artist, release) {
  return replaceTokens(config.discogs_search_release_url, {artist: artist, release: release});
}

/**
 * @param {String} releaseUrl
 * @returns {String}
 */
export function generateSubmissionNotes(releaseUrl) {
  return replaceTokens(config.text.notes, {
    extension_url: config.extension_url,
    release_url: releaseUrl
  });
}
