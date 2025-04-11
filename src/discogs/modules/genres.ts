import { hasOwnProperty } from '../../utils/utils';
import genres from '../../data/discogs_genres.json';

/**
 * Returns the genre corresponding to the given style.
 * @param style - The musical style to look up.
 * @returns The genre if found, otherwise null.
 */
export function getGenreByStyle(style: string): string | null {
  return getPropertyByElement(genres, style);
}

function getPropertyByElement(
  obj: Record<string, string[]>,
  element: string
): string | null {
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
