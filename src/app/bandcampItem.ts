import { removeBandcampMusicPath } from '../bandcamp/modules/url';
import { generateKeyForUrl } from '../utils/key-generator';
import {
  getUrlHostname,
  getUrlHostnameUrl,
  removeQueryParams
} from '../utils/url';

export abstract class BandcampItem {
  public url: string;
  public uuid: string;
  public image?: string;
  public visit?: Date;
  public id?: number;

  constructor(url: string, image?: string, visit?: Date, id?: number) {
    this.url = removeQueryParams(url);
    this.url = removeBandcampMusicPath(this.url);
    this.uuid = generateKeyForUrl(this.url);
    this.image = image;
    this.visit = visit;
    this.id = id;
  }

  get artistHostname() {
    return getUrlHostname(this.url);
  }

  get artistUrl() {
    return getUrlHostnameUrl(this.url);
  }
}

export function createBandcampItemMap(
  items: BandcampItem[]
): Map<string, BandcampItem> {
  return new Map<string, BandcampItem>(items.map((item) => [item.uuid, item]));
}
