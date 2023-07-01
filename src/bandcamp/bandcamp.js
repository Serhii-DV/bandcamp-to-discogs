import { isArray, isString } from "../modules/helpers.js";
import { Style, getMapping } from "./mapping.js";

/**
 * @param {String} keyword
 * @returns {Array<String>}
 */
export function keywordToDiscogsGenre(keyword) {
  const keywordMapping = getMapping();

  if (keyword in keywordMapping) {
    const keywordMapData = keywordMapping[keyword];

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

  if (keyword in keywordMapping) {
    const keywordMapData = keywordMapping[keyword];

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
 * @param {Array<Array<String>>}
 * @return {Array<String>}
 */
function arrayToFlat(arr) {
  return [].concat(...arr);
}

/**
 * @param {Array<Array<String>|String>}
 * @return {Array<String>}
 */
function arrayUnique(arr) {
  return [...new Set(arrayToFlat(arr))];
}

/**
 * @param {Array<String>} keywords
 * @returns {Array<String>}
 */
export function keywordsToDiscogsGenres(keywords) {
  console.log('keywordsToDiscogsGenres');
  console.log(arrayUnique(keywords.map(keywordToDiscogsGenre)));
  return arrayUnique(keywords.map(keywordToDiscogsGenre));
}

/**
 * @param {Array<String>} keywords
 * @returns {Array<String>}
 */
export function keywordsToDiscogsStyles(keywords) {
  return arrayUnique(keywords.map(keywordToDiscogsStyles));
}
