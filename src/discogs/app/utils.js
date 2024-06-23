/**
 * Returns Discogs formatted date
 * @param {Date} date
 * @returns {String}
 */
export const getDiscogsDateValue = date => {
  return date.toISOString().split('T')[0];
};
