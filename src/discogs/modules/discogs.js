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
export function generateSubmissionNotesDefault(releaseUrl) {
  return replaceTokens(config.discogs.draft.submission_notes.default, {
    release_url: releaseUrl
  });
}

export function generateSubmissionNotesShort(releaseUrl) {
  return replaceTokens(config.discogs.draft.submission_notes.short, {
    release_url: releaseUrl
  });
}

export function generateSelfReleasedLabel(artist) {
  return replaceTokens(config.discogs.draft.self_released, { artist });
}
