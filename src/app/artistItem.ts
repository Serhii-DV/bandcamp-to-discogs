import { generateKeyForUrl } from '../utils/key-generator';

export class ArtistItem {
  public url: string;
  public uuid: string;
  public name: string;
  public visit?: Date;
  public id?: number;

  constructor(url: string, name: string, visit?: Date, id?: number) {
    this.url = url;
    this.uuid = generateKeyForUrl(url);
    this.name = name;
    this.visit = visit;
    this.id = id;
  }
}
