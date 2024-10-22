import { removeQueryParams } from '../utils/url';
import { generateKeyForUrl } from '../utils/key-generator';
import { removeBandcampMusicPath } from '../bandcamp/modules/url';

export class ArtistItem {
  public url: string;
  public uuid: string;
  public name: string;
  public visit?: Date;
  public id?: number;

  constructor(url: string, name: string, visit?: Date, id?: number) {
    this.url = removeQueryParams(url);
    this.url = removeBandcampMusicPath(this.url);
    this.uuid = generateKeyForUrl(this.url);
    this.name = name;
    this.visit = visit;
    this.id = id;
  }
}
