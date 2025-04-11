import { getGenreByStyle } from '../../discogs/modules/genres';
import { hasOwnProperty, isArray, isEmptyObject } from '../../utils/utils';
import keywordMapping from '../../data/keyword_mapping.json';
interface KeywordMapping {
  [key: string]: string | string[] | Style;
}

let mapping: KeywordMapping = {};

export function getMapping(): KeywordMapping {
  if (isEmptyObject(mapping)) {
    mapping = createMapping(keywordMapping);
  }

  return mapping;
}

function createMapping(
  keywordMapping: Record<string, string | string[]>
): KeywordMapping {
  const mapping: KeywordMapping = {};

  for (const key in keywordMapping) {
    if (hasOwnProperty(keywordMapping, key)) {
      const value = keywordMapping[key];
      if (value !== '') {
        mapping[key] = isArray(value) ? value : new Style(value as string);
      }
    }
  }

  return mapping;
}

export class Style {
  constructor(public style: string) {}

  get genre(): string {
    return getGenreByStyle(this.style) ?? '';
  }
}
