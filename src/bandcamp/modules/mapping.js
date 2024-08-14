import { getGenreByStyle } from '../../discogs/modules/genres.js';
import { hasOwnProperty, isEmptyObject, isObject, isString } from '../../utils/utils';

let mapping = {};

export function getMapping() {
  return (mapping = isEmptyObject(mapping)
    ? createMapping(keywordMapping)
    : mapping);
}

function createMapping(keywordMapping) {
  const mapping = {};

  for (const key in keywordMapping) {
    if (hasOwnProperty(keywordMapping, key)) {
      const value = keywordMapping[key];
      if (value !== '') {
        mapping[key] = isString(value) ? new Style(value) : value;
      }
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
    return (this._genre = isObject(this._genre)
      ? this._genre
      : getGenreByStyle(this.style));
  }
}

let keywordMapping = {};

export async function loadKeywordMapping(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      keywordMapping = data;
      return keywordMapping;
    })
    .catch((reason) => {
      keywordMapping = {};
    });
}
