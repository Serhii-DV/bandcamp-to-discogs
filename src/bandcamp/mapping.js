import { getGenreByStyle } from "../discogs/genres.js";
import { isEmptyObject, isObject, isString } from "../modules/helpers.js";

let mapping = {};

export function getMapping() {
  return mapping = isEmptyObject(mapping) ? createMapping(keywordMapping) : mapping;
}

function createMapping(keywordMapping) {
  let mapping = {};

  for (const key in keywordMapping) {
    if (keywordMapping.hasOwnProperty(key)) {
      const value = keywordMapping[key];
      mapping[key] = isString(value) ? new Style(value) : value;
    }
  }

  return mapping;
}

export class Style {
  constructor(style) {
    this.style = style;
    this._genre = null;
  }

  get genre() {
    return this._genre = (isObject(this._genre) ? this._genre : getGenreByStyle(this.style));
  }
}

let keywordMapping = {};

export async function loadKeywordMapping(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      keywordMapping = data;
      return keywordMapping;
    }).catch(reason => {
      keywordMapping = {};
    });
}
