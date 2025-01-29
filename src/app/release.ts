import { ReleaseArtist } from './releaseArtist';
import { ReleaseItem } from './releaseItem';
import { Track } from './track';

export class Release {
  releaseItem: ReleaseItem;
  label: string;
  published: Date;
  modified: Date;
  tracks: Track[];
  tracksQty: number;
  image: string;
  keywords: string[];
  credit: string;

  constructor(
    artist: string,
    title: string,
    label: string,
    datePublished: Date,
    dateModified: Date,
    tracks: Track[],
    url: string,
    image: string,
    keywords: string[],
    credit: string
  ) {
    this.releaseItem = new ReleaseItem(url, artist, title);
    this.label = label;
    this.published = datePublished;
    this.modified = dateModified;
    this.tracks = tracks;
    this.tracksQty = tracks.length;
    this.image = image;
    this.keywords = keywords;
    this.credit = credit;
  }

  get artist(): ReleaseArtist {
    return this.releaseItem.artist;
  }

  get url(): string {
    return this.releaseItem.url.toString();
  }

  get releaseHostname(): string {
    return this.releaseItem.url.withoutProtocol;
  }

  get title(): string {
    return this.releaseItem.title;
  }

  get uuid(): string {
    return this.releaseItem.uuid;
  }

  get year(): number {
    return this.published.getFullYear();
  }

  get artistHostname(): string {
    return this.releaseItem.artistHostname;
  }

  get artistUrl(): string {
    return this.releaseItem.artistUrl;
  }

  toStorageObject(): object {
    return {
      artist: this.releaseItem.artist,
      title: this.releaseItem.title,
      url: this.releaseItem.url.toString(),
      label: this.label,
      published: this.published.toISOString(),
      modified: this.modified.toISOString(),
      tracks: this.tracks.map((track) => track.toStorageObject()),
      image: this.image,
      keywords: this.keywords,
      credit: this.credit
    };
  }

  static fromStorageObject(obj: any): Release {
    if (!obj.url || !obj.tracks) {
      throw new Error('Cannot create Release object from object');
    }

    const tracks = obj.tracks.map((trackData: any) =>
      Track.fromStorageObject(trackData)
    );

    if (!obj.published && !obj.date) {
      throw new Error('Missing published or date property');
    }

    if (!obj.modified && !obj.date) {
      throw new Error('Missing published or date property');
    }

    return new Release(
      obj.artist,
      obj.title,
      obj.label,
      new Date(obj.published ?? obj.date),
      new Date(obj.modified ?? obj.date),
      tracks,
      obj.url,
      obj.image,
      obj.keywords,
      obj.credit ?? ''
    );
  }
}
