/**
 * Returns Discogs formatted date
 * @param {Date} date
 * @returns {String}
 */
export const getDiscogsDateValue = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * @param {string} url
 * @returns {Boolean}
 */
export const isValidDiscogsReleaseEditUrl = (url) => {
  const discogsEditUrl = 'www.discogs.com/release/edit/';
  return url.includes(discogsEditUrl);
};
