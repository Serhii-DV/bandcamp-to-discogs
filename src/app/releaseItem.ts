import { IReleaseItem, StorageData } from 'src/types';
import { BandcampItem } from './bandcampItem';
import { ReleaseArtist } from './releaseArtist';

export class ReleaseItem extends BandcampItem {
  public artist: ReleaseArtist;
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
    this.artist = ReleaseArtist.fromString(artist);
    this.title = title;
    this.label = label;
  }

  get artists(): string[] {
    return this.artist.names;
  }

  toStorageData(): StorageData {
    const self = this;
    return {
      url: self.url.toString(),
      artist: self.artist.toString(),
      title: self.title,
      label: self.label,
      image: self.image,
      visit: self.visit?.toISOString(),
      id: self.id
    };
  }

  static fromObject(obj: IReleaseItem): ReleaseItem {
    return new ReleaseItem(
      obj.url,
      obj.artist,
      obj.title,
      obj.id,
      obj.label || '',
      obj.visit ? new Date(obj.visit) : undefined
    );
  }
}
