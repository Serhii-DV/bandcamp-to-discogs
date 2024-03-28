import { generateSubmissionNotes } from '../discogs/modules/discogs.js';
import { getExtensionManifest } from '../modules/chrome.js';
import { generateKeyForUrl } from '../modules/key-generator.js';
import { padStringLeft } from '../modules/utils.js';

export class ReleaseItem {
  constructor(url, artist, title) {
    this.url = url;
    this.artist = artist;
    this.title = title;
    this.uuid = generateKeyForUrl(url);
  }

  static fromObject(obj) {
    return new ReleaseItem(obj.url, obj.artist, obj.title);
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
  datePublished;

  /**
   * @type {Date}
   */
  dateModified;

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
   * @param {string} artist
   * @param {string} title
   * @param {string} label
   * @param {Date} datePublished
   * @param {Array.<Track>} tracks
   * @param {string} url
   * @param {string} image
   * @param {Array.<string>} keywords
   */
  constructor(artist, title, label, datePublished, tracks, url, image, keywords) {
    this.releaseItem = new ReleaseItem(url, artist, title);
    this.label = label;
    this.datePublished = datePublished;
    this.tracks = tracks;
    this.tracksQty = tracks.length;
    this.image = image;
    this.keywords = keywords;
  }

  get artist() {
    return this.releaseItem.artist;
  }

  get url() {
    return this.releaseItem.url;
  }

  get title() {
    return this.releaseItem.title;
  }

  toStorageObject() {
    return {
      uuid: this.releaseItem.uuid,
      artist: this.releaseItem.artist,
      title: this.releaseItem.title,
      url: this.releaseItem.url,
      label: this.label,
      datePublished: this.datePublished.toISOString(),
      tracks: this.tracks,
      image: this.image,
      keywords: this.keywords
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

    const tracks = obj.tracks.map(trackData => new Track(
      trackData.num,
      trackData.title,
      trackData.duration
    ));

    return new Release(
      obj.artist,
      obj.title,
      obj.label,
      new Date(obj.date ?? obj.datePublished),
      tracks,
      obj.url,
      obj.image,
      obj.keywords
    );
  }

  /**
   * Returns release metadata
   * @param {Release} release
   * @returns Object
   */
  toMetadata() {
    const manifest = getExtensionManifest();
    return {
      version: manifest.version,
      format: {
        qty: this.tracksQty,
        fileType: 'FLAC',
        description: 'Album'
      },
      submissionNotes: generateSubmissionNotes(this)
    };
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
   * @type {TrackDuration}
   */
  duration;

  /**
   * @param {String} num
   * @param {String} title
   * @param {TrackDuration} duration
   */
  constructor(num, title, duration) {
    this.num = num;
    this.title = title;
    this.duration = duration;
  }
}

export class TrackDuration {
  /**
   * @type {Date}
   */
  date;

  /**
   * @type {string}
   */
  value;

  /**
   * @param {Number} hours
   * @param {Number} minutes
   * @param {Number} seconds
   */
  constructor(hours, minutes, seconds) {
    this.date = new Date(0);
    this.date.setHours(hours);
    this.date.setMinutes(minutes);
    this.date.setSeconds(seconds);
    this.value = this.toString();
  }

  /**
   * Returns a string representation of the duration in the format "HH:MM:SS".
   * @returns {string} String representation of the duration.
   */
  toString() {
    const formatter = new Intl.DateTimeFormat('en', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return formatter.format(this.date);
  }

  /**
   * Creates a Duration instance from a duration string.
   * The duration string should be in the format "XHYMZS",
   * where X is hours, Y is minutes, and Z is seconds.
   * See: https://en.wikipedia.org/wiki/ISO_8601
   * @param {string} duration
   * @returns {TrackDuration}
   */
  static fromDuration(duration) {
    const regexHours = /(\d+)H/;
    const regexMinutes = /(\d+)M/;
    const regexSeconds = /(\d+)S/;
    const hours = (regexHours.exec(duration) || [])[1] || 0;
    const minutes = (regexMinutes.exec(duration) || [])[1] || 0;
    const seconds = (regexSeconds.exec(duration) || [])[1] || 0;

    return new TrackDuration(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
  }
}

function durationFromSeconds(duration) {
  let minutes = Math.floor(duration / 60);
  let seconds = duration % 60;

  return minutes.toString() + ':' + padStringLeft(seconds.toString(), '0', 2);
}
