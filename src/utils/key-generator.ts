import { Release } from 'src/app/release';
import { ReleaseItem } from 'src/app/releaseItem';
import { v5 as uuid5 } from 'uuid';

export function generateKeyForUrl(url: string): string {
  const uuid = uuid5(url, uuid5.URL);
  // console.log(`B2D: uuid5(${url}): `, uuid);
  return uuid;
}

export function generateKeyForReleaseItem(releaseItem: ReleaseItem): string {
  return generateKeyForUrl(releaseItem.url);
}

export function generateKeyForRelease(release: Release): string {
  return generateKeyForReleaseItem(release.releaseItem);
}

export function generateKeysFromUrls(urls: string[]): string[] {
  const keys: string[] = [];
  urls.forEach((url: string) => keys.push(generateKeyForUrl(url)));
  return keys;
}

export function generateKeyUrlMapFromUrls(
  urls: string[]
): Record<string, string> {
  const keyUrlMap: Record<string, string> = {};

  urls.forEach((url: string) => {
    const key = generateKeyForUrl(url);
    keyUrlMap[key] = url;
  });

  return keyUrlMap;
}
