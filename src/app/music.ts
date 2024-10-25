import { ArtistItem } from './artistItem';
import { ReleaseItem } from './releaseItem';

export class Music {
  public artist: ArtistItem;
  public albums: ReleaseItem[];

  constructor(artist: ArtistItem, albums: ReleaseItem[]) {
    this.artist = artist;
    this.albums = albums;
  }
}
