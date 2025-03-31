import { trimCharactersFromString } from 'src/utils/string';
import { ReleaseItem } from '../../app/releaseItem';
import { element, getDataAttribute } from '../../utils/html';
import { removeInvisibleChars } from '../../utils/utils';

export function getMusicAlbumSchemaData(): any {
  const jsonLdScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  return jsonLdScript ? JSON.parse(jsonLdScript.textContent || '') : null;
}

function createReleaseItemFromMusicGridElement(element: Element): ReleaseItem {
  let artist = (element.querySelector('.artist-override') as HTMLElement)
    ?.innerText;

  if (!artist) {
    artist = (
      document.querySelector('#band-name-location .title') as HTMLElement
    ).innerText;
  }

  artist = trimCharactersFromString(artist, ' -\n');
  artist = removeInvisibleChars(artist);

  const titleParts = (
    element.querySelector('.title') as HTMLElement
  ).innerText.split('\n');
  const title = removeInvisibleChars(titleParts[0]);
  const url =
    (element.querySelector('a') as HTMLAnchorElement).getAttribute('href') ||
    '';
  const itemId = parseInt(
    getDataAttribute(element, 'item-id').replace('album-', '')
  );

  return new ReleaseItem(
    (url[0] === '/' ? window.location.origin : '') + url,
    artist,
    title,
    itemId
  );
}

export function getReleaseItems(): ReleaseItem[] {
  const releaseItems: ReleaseItem[] = [];
  const releaseElements = document.querySelectorAll(
    '#music-grid .music-grid-item'
  );

  releaseElements.forEach((element) => {
    const releaseItem = createReleaseItemFromMusicGridElement(element);
    releaseItems.push(releaseItem);
  });

  return releaseItems;
}

export function getBandPhotoSrc(): string | undefined {
  const bandPhoto = document.querySelector('.band-photo') as HTMLImageElement;
  return bandPhoto ? bandPhoto.src : undefined;
}

export function extractBCSearchInputStyle(): CSSStyleDeclaration | null {
  const bcSearchInputElement = document.querySelector(
    'input.search-bar'
  ) as HTMLInputElement;
  return bcSearchInputElement
    ? window.getComputedStyle(bcSearchInputElement)
    : null;
}

export function getDigitalAudioQuality(): string {
  return (
    extractAudioQuality(element('.digital .audio-quality')?.innerText ?? '') ??
    ''
  );
}

function extractAudioQuality(input: string): string | null {
  const match = input.match(/(\d+-bit\/\d+(?:\.\d+)?kHz)/);

  return match ? match[1] : null;
}
