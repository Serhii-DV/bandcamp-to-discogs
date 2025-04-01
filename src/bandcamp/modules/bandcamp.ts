import config from '../../config';
import {
  arrayUnique,
  isArray,
  isString,
  replaceTokens
} from '../../utils/utils';
import { Style, getMapping } from './mapping';

export function keywordToDiscogsGenre(keyword: string): string[] {
  const keywordMapping = getMapping();
  const key = keyword.toLowerCase();

  if (key in keywordMapping) {
    const keywordMapData = keywordMapping[key];

    if (keywordMapData instanceof Style) {
      return [keywordMapData.genre as string];
    }

    if (isArray(keywordMapData)) {
      return keywordsToDiscogsGenres(keywordMapData as string[]);
    }

    if (isString(keywordMapData)) {
      return keywordToDiscogsGenre(keywordMapData as string);
    }
  }

  return [];
}

export function keywordToDiscogsStyles(keyword: string): string[] {
  const keywordMapping = getMapping();
  const key = keyword.toLowerCase();

  if (key in keywordMapping) {
    const keywordMapData = keywordMapping[key];

    if (keywordMapData instanceof Style) {
      return [keywordMapData.style];
    }

    if (isArray(keywordMapData)) {
      return keywordsToDiscogsStyles(keywordMapData as string[]);
    }

    if (isString(keywordMapData)) {
      return keywordToDiscogsStyles(keywordMapData as string);
    }
  }

  return [];
}

export function keywordsToDiscogsGenres(keywords: string[]): string[] {
  return arrayUnique(keywords.flatMap(keywordToDiscogsGenre));
}

export function keywordsToDiscogsStyles(keywords: string[]): string[] {
  return arrayUnique(keywords.flatMap(keywordToDiscogsStyles));
}

export function getBandcampSearchAllUrl(query: string): string {
  return replaceTokens(config.bandcamp.search.all, {
    query: encodeURIComponent(query)
  });
}

export function getBandcampSearchArtistUrl(artist: string): string {
  return replaceTokens(config.bandcamp.search.artist, {
    query: encodeURIComponent(artist)
  });
}

export function getBandcampSearchReleaseUrl(
  artist: string,
  release: string
): string {
  return replaceTokens(config.bandcamp.search.release, {
    query: encodeURIComponent(`${artist} ${release}`)
  });
}

export function getBandcampSearchReleaseAllUrl(
  artist: string,
  release: string
): string {
  return getBandcampSearchAllUrl(`${artist} ${release}`);
}
