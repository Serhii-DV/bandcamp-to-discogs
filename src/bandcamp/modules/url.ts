import { getUrlPath } from '../../utils/url';

const bandcampHost = 'bandcamp.com';
const bandcampPathMusic = '/music';
const bandcampPathAlbum = '/album';
const bandcampAlbumPart = bandcampHost + bandcampPathAlbum + '/';

export function isValidBandcampURL(url: string): boolean {
  return url.includes(bandcampHost);
}

export function isBandcampAlbumUrl(url: string): boolean {
  return url.includes(bandcampAlbumPart);
}

export function isBandcampArtistUrl(url: string): boolean {
  if (!url.includes(bandcampHost)) return false;
  const path = getUrlPath(url);

  return path === '/' || path === bandcampPathMusic;
}
