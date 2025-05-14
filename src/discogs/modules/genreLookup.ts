import { hasOwnProperty } from '../../utils/utils';
import rawGenres from '../../data/discogs_genres.json';

type GenreMap = {
  [genre: string]: string[];
};
const genres: GenreMap = rawGenres;

export class GenreLookup {
  static getByStyle(style: string): string | null {
    return this.findGenreByStyle(style);
  }

  private static findGenreByStyle(style: string): string | null {
    for (const genre in genres) {
      if (hasOwnProperty(genres, genre)) {
        const subGenres = genres[genre];
        if (subGenres.includes(style)) {
          return genre;
        }
      }
    }
    return null;
  }
}
