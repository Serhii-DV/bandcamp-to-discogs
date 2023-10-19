/**
 * @param {String} style
 * @returns {String}
 */
export function getGenreByStyle(style) {
  return getPropertyByElement(genres, style);
}

let genres = {};

export async function loadDiscogsGenres(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      genres = data;
      return genres;
    }).catch(reason => {
      genres = {};
    });
}

function getPropertyByElement(obj, element) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const subGenres = obj[prop];
      if (subGenres.includes(element)) {
        return prop;
      }
    }
  }
  return null; // Element not found
}
