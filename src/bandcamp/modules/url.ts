const bandcampHost = 'bandcamp.com';

export function isValidBandcampURL(url: string): boolean {
  return url.includes(bandcampHost);
}
