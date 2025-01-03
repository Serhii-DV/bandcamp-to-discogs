import { ReleaseItem } from './releaseItem';
import { Track } from './track';

export class Release {
  /**
   * @type {ReleaseItem}
   */
  releaseItem;

  /**
   * @type {string}
   */
  label;

  /**
   * @type {Date}
   */
  published;

  /**
   * @type {Date}
   */
  modified;

  /**
   * @type {Array.<Track>}
   */
  tracks;

  /**
   * @type {Number}
   */
  tracksQty;

  /**
   * @type {string}
   */
  image;

  /**
   * @type {Array.<string>}
   */
  keywords;

  /**
   * @type {string}
   */
  credit;

  /**
   * @param {string} artist
   * @param {string} title
   * @param {string} label
   * @param {Date} datePublished
   * @param {Date} dateModified
   * @param {Array.<Track>} tracks
   * @param {string} url
   * @param {string} image
   * @param {Array.<string>} keywords
   * @param {string} credit
   */
  constructor(
    artist,
    title,
    label,
    datePublished,
    dateModified,
    tracks,
    url,
    image,
    keywords,
    credit
  ) {
    this.releaseItem = new ReleaseItem(url, artist, title);
    this.label = label;
    undefined;
    this.published = datePublished;
    this.modified = dateModified;
    this.tracks = tracks;
    this.tracksQty = tracks.length;
    this.image = image;
    this.keywords = keywords;
    this.credit = credit;
  }

  get artist() {
    return this.releaseItem.artist;
  }

  get url() {
    return this.releaseItem.url;
  }

  get releaseHostname() {
    return this.releaseItem.url.withoutProtocol;
  }

  get title() {
    return this.releaseItem.title;
  }

  get uuid() {
    return this.releaseItem.uuid;
  }

  get year() {
    return this.published.getFullYear();
  }

  get artistHostname() {
    return this.releaseItem.artistHostname;
  }

  get artistUrl() {
    return this.releaseItem.artistUrl;
  }

  toStorageObject() {
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

  /**
   * Create an instance of the Release class from the object.
   * @param {Object} obj - A simple object.
   * @returns {Release} An instance of the Release class.
   */
  static fromStorageObject(obj) {
    if (!obj.url || !obj.tracks) {
      throw new Error('Cannot create Release object from object', obj);
    }

    const tracks = obj.tracks.map((trackData) =>
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
