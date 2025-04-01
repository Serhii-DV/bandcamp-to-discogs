import { getGenreByStyle } from '../../discogs/modules/genres.js';
import { hasOwnProperty, isEmptyObject, isString } from '../../utils/utils';

interface KeywordMapping {
  [key: string]: string | Style;
}

let mapping: KeywordMapping = {};

export function getMapping(): KeywordMapping {
  return (mapping = isEmptyObject(mapping)
    ? createMapping(keywordMapping)
    : mapping);
}

function createMapping(keywordMapping: Record<string, string>): KeywordMapping {
  const mapping: KeywordMapping = {};

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
  constructor(public style: string) {}

  get genre(): string {
    return getGenreByStyle(this.style);
  }
}

let keywordMapping: Record<string, string> = {};

export async function loadKeywordMapping(
  url: string
): Promise<Record<string, string>> {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      keywordMapping = data;
      return keywordMapping;
    })
    .catch(() => {
      keywordMapping = {};
      return keywordMapping;
    });
}
