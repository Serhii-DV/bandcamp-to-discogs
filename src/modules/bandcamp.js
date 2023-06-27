import { isArray } from "./helpers.js";

/**
 * @param {String} keyword
 * @returns {Array<String>}
 */
export function keywordToDiscogsGenre(keyword) {
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
  return arrayUnique(keywords.map(keywordToDiscogsGenre));
}

/**
 * @param {Array<String>} keywords
 * @returns {Array<String>}
 */
export function keywordsToDiscogsStyles(keywords) {
  return arrayUnique(keywords.map(keywordToDiscogsStyles));
}

class Style {
  constructor(genre, style) {
    this.genre = genre;
    this.style = style;
  }
}

const keywordMapping = {
  "ambient": new Style("Electronic","Ambient"),
  "drone": new Style("Electronic","Drone"),
  "dark ambient": new Style("Electronic","Dark Ambient"),
  "darkwave": new Style("Electronic","Darkwave"),
  "experimental": new Style("Electronic","Experimental"),
  "folk": new Style("Folk, World, & Country","Folk"),
  "industrial": new Style("Electronic","Industrial"),
  "martial": new Style("Brass & Military","Military"),
  "neoclassical": new Style("Classical","Neo-Classical"),
  "neofolk": new Style("Electronic","Neofolk"),
  "nordic": new Style("Folk, World, & Country","Nordic"),
  // Combined tags
  "bombastic": ["martial industrial", "neoclassical"],
  "martial industrial": ["martial", "industrial"],
  "martial folk": ["martial", "neofolk"],
  // Aliases
  "darkambient": "dark ambient",
  "martial-industrial": "martial industrial",
  "neo-folk": "neofolk",
  "neoklassik": "neoclassical",
  "neo-classical": "neoclassical",
  // Unknown?
  // "apocalyptic folk",
  // "atmospheric",
  // "cinematic",
  // "darkfolk",
  // "dark folk",
  // "dark horror",
  // "death industrial",
  // "field recordings",
  // "martial pop",
  // "modern classical",
  // "orchestral",
  // "post-industrial",
  // "power electronics",
  // "ritual",
  // "ritual dark ambient",
};
