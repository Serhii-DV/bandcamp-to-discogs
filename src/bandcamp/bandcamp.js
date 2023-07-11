import { arrayUnique, isArray, isString } from "../modules/utils.js";
import { Style, getMapping } from "./mapping.js";

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
