/**
 * @param {String} style
 * @returns {String}
 */
export function getGenreByStyle(style) {
  return getPropertyByElement(genres, style);
}

// const GENRES_URL = 'https://gist.githubusercontent.com/Serhii-DV/14d7ec13fd15e30db1a2a8dff047abbf/raw/02fe41ab5ea493202bb423fef3640d5d8394af63/discogs_genres_and_styles.json';
const GENRES_URL = '../../assets/discogs/genres.json';
let genres = {};

export async function loadDiscogsGenres() {
  return fetch(GENRES_URL)
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
