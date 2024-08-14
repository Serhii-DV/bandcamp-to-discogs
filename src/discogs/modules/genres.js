import { hasOwnProperty } from "src/utils/utils";

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
    .then((response) => response.json())
    .then((data) => {
      genres = data;
      return genres;
    })
    .catch(() => {
      genres = {};
    });
}

function getPropertyByElement(obj, element) {
  for (const prop in obj) {
    if (hasOwnProperty(obj, prop)) {
      const subGenres = obj[prop];
      if (subGenres.includes(element)) {
        return prop;
      }
    }
  }
  return null; // Element not found
}
