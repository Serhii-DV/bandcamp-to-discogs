import { v5 as uuid5} from 'uuid';
import { Release } from '../app/release.js';

/**
 * @param {String} url
 * @returns {String}
 */
export function generateKeyForUrl(url) {
  const uuid = uuid5(url, uuid5.URL);
  // console.log(`B2D: uuid5(${url}): `, uuid);
  return uuid;
}

/**
 * @param {Release} release
 * @return {String}
 */
export function generateKeyForRelease(release) {
  return generateKeyForUrl(release.releaseItem.url);
}

export function generateKeysFromUrls(urls) {
  const keys = [];
  urls.forEach(url => keys.push(generateKeyForUrl(url)));
  return keys;
}

export function generateKeyUrlMapFromUrls(urls) {
  const keyUrlMap = {};

  urls.forEach(url => {
    const key = generateKeyForUrl(url);
    keyUrlMap[key] = url;
  });

  return keyUrlMap;
}
