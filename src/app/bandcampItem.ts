import { removeBandcampMusicPath } from '../bandcamp/modules/url';
import { generateKeyForUrl } from '../utils/key-generator';
import { removeQueryParams } from '../utils/url';

export abstract class BandcampItem {
  public url: string;
  public uuid: string;
  public visit?: Date;
  public id?: number;

  constructor(url: string, visit?: Date, id?: number) {
    this.url = removeQueryParams(url);
    this.url = removeBandcampMusicPath(this.url);
    this.uuid = generateKeyForUrl(this.url);
    this.visit = visit;
    this.id = id;
  }
}
