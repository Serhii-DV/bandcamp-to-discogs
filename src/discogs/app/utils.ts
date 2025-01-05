/**
 * Returns Discogs formatted date
 */
export const getDiscogsDateValue = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isValidDiscogsReleaseEditUrl = (url: string): boolean => {
  const discogsEditUrl = 'www.discogs.com/release/edit/';
  return url.includes(discogsEditUrl);
};
