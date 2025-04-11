import { hasOwnProperty, isArray, isEmptyObject } from '../../utils/utils';
import keywordMapping from '../../data/keyword_mapping.json';
import { Style } from '../../discogs/app/style';

interface KeywordMapping {
  [key: string]: string | string[] | Style;
}

let mapping: KeywordMapping = {};

export function getKeywordMapping(): KeywordMapping {
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
