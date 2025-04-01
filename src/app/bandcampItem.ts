import { urlToUuid } from '../utils/utils';
import { BandcampURL } from './core/bandcampUrl';

export abstract class BandcampItem {
  public url: BandcampURL;
  public uuid: string;
  public image?: string;
  public visit?: Date;
  public id?: number;

  constructor(url: string, image?: string, visit?: Date, id?: number) {
    this.url = new BandcampURL(url);
    this.uuid = urlToUuid(this.url.toString());
    this.image = image;
    this.visit = visit;
    this.id = id;
  }

  get artistHostname() {
    return this.url.hostname;
  }

  get artistUrl() {
    return this.url.hostnameWithProtocol;
  }
}

export function createBandcampItemMap(
  items: BandcampItem[]
): Map<string, BandcampItem> {
  return new Map<string, BandcampItem>(items.map((item) => [item.uuid, item]));
}
