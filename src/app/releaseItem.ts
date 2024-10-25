import { BandcampItem } from './bandcampItem';

export class ReleaseItem extends BandcampItem {
  public artist: string;
  public title: string;
  public label: string;

  constructor(
    url: string,
    artist: string,
    title: string,
    id?: number,
    label: string = '',
    visit?: Date
  ) {
    super(url, undefined, visit, id);
    this.artist = artist;
    this.title = title;
    this.label = label;
  }

  static fromObject(obj: {
    url: string;
    artist: string;
    title: string;
    id?: number;
    itemId?: number;
    label?: string;
    visit?: Date;
  }): ReleaseItem {
    return new ReleaseItem(
      obj.url,
      obj.artist,
      obj.title,
      obj.id || obj.itemId,
      obj.label || '',
      obj.visit
    );
  }
}
