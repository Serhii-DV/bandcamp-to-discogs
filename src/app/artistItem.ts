import { BandcampItem } from './bandcampItem';

export class ArtistItem extends BandcampItem {
  public name: string;

  constructor(
    url: string,
    name: string,
    image?: string,
    visit?: Date,
    id?: number
  ) {
    super(url, image, visit, id);
    this.name = name;
  }
}
