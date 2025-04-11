import { getGenreByStyle } from '../modules/genres';

export class Style {
  constructor(public style: string) {}

  get genre(): string {
    return getGenreByStyle(this.style) ?? '';
  }
}
