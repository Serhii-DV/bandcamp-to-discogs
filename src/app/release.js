import {
  getUrlHostname,
  getUrlHostnameUrl,
  removeProtocol
} from '../utils/url';
import { generateKeyForUrl } from '../utils/key-generator';
import TrackTime from './trackTime.js';

export class ReleaseItem {
  constructor(url, artist, title, itemId = '') {
    this.url = url;
    this.artist = artist;
    this.title = title;
    this.itemId = itemId;
    this.uuid = generateKeyForUrl(url);
  }

  static fromObject(obj) {
    return new ReleaseItem(obj.url, obj.artist, obj.title, obj.itemId);
  }
}

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
    return removeProtocol(this.releaseItem.url);
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
    return getUrlHostname(this.releaseItem.url);
  }

  get artistUrl() {
    return getUrlHostnameUrl(this.releaseItem.url);
  }

  toStorageObject() {
    return {
      artist: this.releaseItem.artist,
      title: this.releaseItem.title,
      url: this.releaseItem.url,
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

export class Track {
  /**
   * @type {String}
   */
  num;

  /**
   * @type {String}
   */
  title;

  /**
   * @type {TrackTime}
   */
  time;

  /**
   * @param {String} num
   * @param {String} title
   * @param {TrackTime} time
   */
  constructor(num, title, time) {
    this.num = num;
    this.title = title;
    this.time = time;
  }

  toStorageObject() {
    return {
      num: this.num,
      title: this.title,
      time: this.time.value
    };
  }

  /**
   * Create an instance of the Track class from the object.
   * @param {Object} obj - A simple object.
   * @returns {Track} An instance of the Track class.
   */
  static fromStorageObject(obj) {
    return new Track(
      obj.num,
      obj.title,
      TrackTime.fromString(obj.time || obj.duration)
    );
  }
}
