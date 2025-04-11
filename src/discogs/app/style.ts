import { GenreLookup } from '../modules/genreLookup';

export class Style {
  public readonly genre: string;

  constructor(public readonly style: string) {
    this.genre = GenreLookup.getByStyle(style) ?? '';
  }
}
