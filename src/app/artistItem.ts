import { BandcampItem } from './bandcampItem';

export class ArtistItem extends BandcampItem {
  public name: string;

  constructor(url: string, name: string, visit?: Date, id?: number) {
    super(url, visit, id);
    this.name = name;
  }
}
