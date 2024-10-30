import { getUrlPath } from '../../utils/url';

const bandcampHost = 'bandcamp.com';
const bandcampDomain = 'https://' + bandcampHost;
const bandcampPathMusic = '/music';
const bandcampPathAlbum = '/album';
const bandcampAlbumPart = bandcampHost + bandcampPathAlbum + '/';

export function isValidBandcampURL(url: string): boolean {
  return url.includes(bandcampHost);
}

export function isBandcampSiteUrl(url: string): boolean {
  return url.includes(bandcampDomain);
}

export function isBandcampAlbumUrl(url: string): boolean {
  return url.includes(bandcampAlbumPart);
}

export function isBandcampArtistUrl(url: string): boolean {
  if (!url.includes(bandcampHost)) return false;
  const path = getUrlPath(url);

  return path === '/' || path === bandcampPathMusic;
}

export function removeBandcampMusicPath(url: string): string {
  const urlObj = new URL(url);
  const segments = urlObj.pathname.split('/').filter(Boolean);

  if (segments[segments.length - 1] === 'music') {
    segments.pop();
    urlObj.pathname = '/' + segments.join('/');
  }

  return urlObj.toString();
}
