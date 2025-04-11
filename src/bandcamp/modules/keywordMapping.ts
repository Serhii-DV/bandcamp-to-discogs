import { Style } from '../../discogs/app/style';
import keywordMapping from '../../data/keyword_mapping.json';
import { hasOwnProperty, isArray, isEmptyObject } from '../../utils/utils';

interface KeywordMapping {
  [key: string]: string | string[] | Style;
}

let mapping: KeywordMapping = {};

/**
 * Retrieves the keyword mapping, creating it if necessary.
 */
export function getKeywordMapping(): KeywordMapping {
  if (isEmptyObject(mapping)) {
    mapping = createMapping(keywordMapping);
  }
  return mapping;
}

/**
 * Creates a keyword mapping based on the provided keyword mapping data.
 */
function createMapping(
  keywordMapping: Record<string, string | string[]>
): KeywordMapping {
  const newMapping: KeywordMapping = {};

  Object.entries(keywordMapping).forEach(([key, value]) => {
    if (hasOwnProperty(keywordMapping, key) && value !== '') {
      newMapping[key] = isArray(value) ? value : new Style(value as string);
    }
  });

  return newMapping;
}
