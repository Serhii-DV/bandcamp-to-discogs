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
   * @param {String} artist
   * @param {String} title
   * @param {String} label
   * @param {Date} date
   * @param {Array} tracks
   * @param {String} url
   * @param {String} image
   * @param {Array} keywords
   */
  constructor(artist, title, label, date, tracks, url, image, keywords) {
    this.releaseItem = new ReleaseItem(url, artist, title);
    this.label = label;
    this.date = date;
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

  /**
   * @param {Object} TralbumData
   * @param {Object} BandData
   * @param {Object} SchemaData
   * @param {Object} coverSrc
   * @returns {Release}
   */
  static fromBandcampData(TralbumData, BandData, SchemaData, coverSrc) {
    const { artist, current, url } = TralbumData;
    const { title, publish_date } = current;
    const { keywords } = SchemaData;
    const tracks = TralbumData.trackinfo.map(track => new Track(
      track.track_num,
      track.title,
      durationFromSeconds(Math.trunc(track.duration))
    ));
    const labelName = BandData.name;
    const label = artist === labelName ? `Not On Label (${labelName} Self-released)` : labelName;

    return new Release(
      artist,
      title,
      label,
      new Date(publish_date),
      tracks,
      url,
      coverSrc.big,
      keywords
    );
  }

  /**
   * @param {Object} schema
   * @returns {Release}
   */
  static fromBandcampSchema(schema) {
    const artist = schema.byArtist.name;
    const title = schema.name;
    const label = schema.publisher.name;
    const date = new Date(schema.datePublished);
    const tracks = schema.track.itemListElement.map(track => new Track(
      track.position,
      track.item.name,
      TrackDuration.fromDuration(track.item.duration)
    ));
    const url = schema.mainEntityOfPage;
    const image = schema.image;
    const keywords = schema.keywords;

    return new Release(
      artist,
      title,
      label,
      date,
      tracks,
      url,
      image,
      keywords
    );
  }

  toObject() {
    return {
      uuid: this.releaseItem.uuid,
      artist: this.releaseItem.artist,
      title: this.releaseItem.title,
      url: this.releaseItem.url,
      label: this.label,
      date: this.date.toISOString(),
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
  static fromObject(obj) {
    if (!obj.url || !obj.tracks) {
      throw new Error('Cannot create Release object from object', obj);
    }

    const tracks = obj.tracks.map(trackData => Track.fromObject(trackData));

    return new Release(
      obj.artist,
      obj.title,
      obj.label,
      new Date(obj.date),
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

  /**
   * Create an instance of the Track class from the object.
   * @param {Object} obj - A simple object.
   * @returns {Track} An instance of the Track class.
   */
  static fromObject(obj) {
    return new Track(
      obj.num,
      obj.title,
      obj.duration
    );
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
