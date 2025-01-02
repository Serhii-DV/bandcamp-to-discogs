import { DiscogsCsv } from '../app/discogs-csv.js';
import config from '../../config.js';
import { replaceTokens } from '../../utils/utils';

/**
 * @param {Release} release
 * @returns {DiscogsCsv}
 */
export function releaseToDiscogsCsv(release) {
  return DiscogsCsv.fromRelease(release);
}

export function getDiscogsSearchAllUrl(query) {
  return replaceTokens(config.discogs.search.all, {
    query: encodeURIComponent(query)
  });
}

export function getSearchDiscogsArtistUrl(artist) {
  return replaceTokens(config.discogs.search.artist, {
    artist: encodeURIComponent(artist)
  });
}

export function getSearchDiscogsReleaseUrl(artist, release) {
  return replaceTokens(config.discogs.search.release, {
    artist: encodeURIComponent(artist),
    release: encodeURIComponent(release)
  });
}

/**
 * @param {String} releaseUrl
 * @returns {String}
 */
export function generateSubmissionNotes(releaseUrl) {
  return replaceTokens(config.text.notes, {
    release_url: releaseUrl
  });
}
