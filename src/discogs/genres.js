/**
 * @param {String} style
 * @returns {String}
 */
export function getGenreByStyle(style) {
  return getPropertyByElement(genres, style);
}

const GENRES_URL = 'https://gist.githubusercontent.com/Serhii-DV/14d7ec13fd15e30db1a2a8dff047abbf/raw/02fe41ab5ea493202bb423fef3640d5d8394af63/discogs_genres_and_styles.json';
let genres = {};

loadJSONFromURL(GENRES_URL)
.then((value) => {
  genres = value;
}).catch((reason) => {
  genres = {};
});

async function loadJSONFromURL(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
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
