import { IArtistItem, StorageData } from 'src/types';
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

  toStorageData(): StorageData {
    const self = this;
    return {
      url: self.url,
      uuid: self.uuid,
      name: self.name,
      image: self.image,
      visit: self.visit?.toISOString(),
      id: self.id
    };
  }

  static fromObject(obj: IArtistItem): ArtistItem {
    console.log('ArtistItem fromObject', obj);
    return new ArtistItem(
      obj.url,
      obj.name,
      obj.image ?? undefined,
      obj.visit ? new Date(obj.visit) : undefined,
      obj.id ?? undefined
    );
  }
}
