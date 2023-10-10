import { getDataAttribute } from "../modules/html.js";
import { removeInvisibleChars, trimCharactersFromString } from "../modules/utils.js";

function extractDataFromMusicGridElement(element) {
  let artist = element.querySelector('.artist-override')?.innerText;

  if (!artist) {
    artist = document.querySelector('#band-name-location .title').innerText;
  }

  artist = trimCharactersFromString(artist, " \-\n");
  artist = removeInvisibleChars(artist);

  const titleParts = element.querySelector('.title').innerText.split("\n");
  const title = removeInvisibleChars(titleParts[0]);
  const url = element.querySelector('a').getAttribute('href');

  return {
    artist: artist,
    title: title,
    url: (url[0] === '/' ? window.location.origin : '') + url,
    item_id: getDataAttribute(element, 'item-id'),
  }
}

export function getReleasesData() {
  const releases = [];
  const releaseElements = document.querySelectorAll('#music-grid .music-grid-item');

  releaseElements.forEach(element => {
    const releaseData = extractDataFromMusicGridElement(element);
    releases.push(releaseData);
  });

  return releases;
}

export function getBandPhotoSrc() {
  const imgBandPhoto = document.querySelector('.band-photo');
  return imgBandPhoto.src;
}
