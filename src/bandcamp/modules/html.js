import { ReleaseItem } from '../../app/releaseItem';
import { getDataAttribute } from '../../utils/html';
import {
  removeInvisibleChars,
  trimCharactersFromString
} from '../../utils/utils';

export function getMusicAlbumSchemaData() {
  const jsonLdScript = document.querySelector(
    'script[type="application/ld+json"]'
  );
  return jsonLdScript ? JSON.parse(jsonLdScript.textContent) : null;
}

function createReleaseItemFromMusicGridElement(element) {
  let artist = element.querySelector('.artist-override')?.innerText;

  if (!artist) {
    artist = document.querySelector('#band-name-location .title').innerText;
  }

  artist = trimCharactersFromString(artist, ' -\n');
  artist = removeInvisibleChars(artist);

  const titleParts = element.querySelector('.title').innerText.split('\n');
  const title = removeInvisibleChars(titleParts[0]);
  const url = element.querySelector('a').getAttribute('href');
  const itemId = getDataAttribute(element, 'item-id');

  return new ReleaseItem(
    (url[0] === '/' ? window.location.origin : '') + url,
    artist,
    title,
    itemId
  );
}

export function getReleaseItems() {
  const releaseItems = [];
  const releaseElements = document.querySelectorAll(
    '#music-grid .music-grid-item'
  );

  releaseElements.forEach((element) => {
    const releaseItem = createReleaseItemFromMusicGridElement(element);
    releaseItems.push(releaseItem);
  });

  return releaseItems;
}

export function getBandPhotoSrc() {
  const imgBandPhoto = document.querySelector('.band-photo');
  return imgBandPhoto.src;
}
