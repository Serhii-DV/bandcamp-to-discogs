import config from '../../config';
import {
  arrayUnique,
  isArray,
  isString,
  replaceTokens
} from '../../utils/utils';
import { Style, getMapping } from './mapping.js';

/**
 * @param {String} keyword
 * @returns {Array<String>}
 */
export function keywordToDiscogsGenre(keyword) {
  const keywordMapping = getMapping();
  const key = keyword.toLowerCase();

  if (key in keywordMapping) {
    const keywordMapData = keywordMapping[key];

    if (keywordMapData instanceof Style) {
      return [keywordMapData.genre];
    }

    if (isArray(keywordMapData)) {
      return keywordsToDiscogsGenres(keywordMapData);
    }

    if (isString(keywordMapData)) {
      return keywordToDiscogsGenre(keywordMapData);
    }
  }

  return [];
}

/**
 * @param {String} keyword
 * @returns {Array<String>}
 */
export function keywordToDiscogsStyles(keyword) {
  const keywordMapping = getMapping();
  const key = keyword.toLowerCase();

  if (key in keywordMapping) {
    const keywordMapData = keywordMapping[key];

    if (keywordMapData instanceof Style) {
      return [keywordMapData.style];
    }

    if (isArray(keywordMapData)) {
      return keywordsToDiscogsStyles(keywordMapData);
    }

    if (isString(keywordMapData)) {
      return keywordToDiscogsStyles(keywordMapData);
    }
  }

  return [];
}

/**
 * @param {Array<String>} keywords
 * @returns {Array<String>}
 */
export function keywordsToDiscogsGenres(keywords) {
  return arrayUnique(keywords.map(keywordToDiscogsGenre));
}

/**
 * @param {Array<String>} keywords
 * @returns {Array<String>}
 */
export function keywordsToDiscogsStyles(keywords) {
  return arrayUnique(keywords.map(keywordToDiscogsStyles));
}

export function getBandcampSearchAllUrl(query) {
  return replaceTokens(config.bandcamp.search.all, {
    query: encodeURIComponent(query)
  });
}

export function getBandcampSearchArtistUrl(artist) {
  return replaceTokens(config.bandcamp.search.artist, {
    query: encodeURIComponent(artist)
  });
}

export function getBandcampSearchReleaseUrl(artist, release) {
  return replaceTokens(config.bandcamp.search.release, {
    query: encodeURIComponent(artist + ' ' + release)
  });
}

export function getBandcampSearchReleaseAllUrl(artist, release) {
  return getBandcampSearchAllUrl(artist + ' ' + release);
}
