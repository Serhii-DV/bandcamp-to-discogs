import { IMusic, IReleaseItem, StorageData } from 'src/types';
import { ArtistItem } from './artistItem';
import { ReleaseItem } from './releaseItem';

export class Music {
  public artist: ArtistItem;
  public albums: ReleaseItem[];

  constructor(artist: ArtistItem, albums: ReleaseItem[]) {
    this.artist = artist;
    this.albums = albums;
  }

  toStorageData(): StorageData {
    return {
      artist: this.artist.toStorageData(),
      albums: this.albums.map((item: ReleaseItem) => item.toStorageData())
    };
  }

  static fromObject(obj: IMusic): Music {
    const artist = ArtistItem.fromObject(obj.artist);
    const albums = obj.albums.map((releaseItem: IReleaseItem) =>
      ReleaseItem.fromObject(releaseItem)
    );
    return new Music(artist, albums);
  }
}
