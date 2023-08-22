import { generateSubmissionNotes } from '../discogs/discogs.js';
import { getExtensionManifest } from '../modules/chrome.js';
import { padStringLeft } from '../modules/utils.js';

export class Release {
  /**
   *
   * @param {String} artist
   * @param {String} title
   * @param {String} label
   * @param {Date} date
   * @param {Array} tracks
   * @param {String} url
   * @param {String} about
   * @param {String} credits
   * @param {String} type
   * @param {Object} coverSrc
   * @param {Array} keywords
   */
  constructor(artist, title, label, date, tracks, url, about, credits, type, coverSrc, keywords) {
    this.artist = artist;
    this.title = title;
    this.label = label;
    this.date = date;
    this.tracks = tracks;
    this.tracksQty = tracks.length;
    this.url = url;
    this.about = about;
    this.credits = credits;
    this.type = type;
    this.coverSrc = coverSrc;
    this.keywords = keywords;
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
    const { title, about, credits, publish_date, type } = current;
    const { keywords } = SchemaData;
    const tracks = TralbumData.trackinfo.map(track => new Track(
      track.track_num,
      track.title,
      track.duration
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
      about,
      credits,
      type,
      coverSrc,
      keywords
    );
  }

  toJSON() {
    return {
      artist: this.artist,
      title: this.title,
      label: this.label,
      date: this.date.toISOString(),
      tracks: this.tracks,
      url: this.url,
      about: this.about,
      credits: this.credits,
      type: this.type,
      coverSrc: this.coverSrc,
      keywords: this.keywords
    };
  }

  /**
   * Create an instance of the Release class from a parsed JSON object.
   * @param {Object} jsonParsedObject - The parsed JSON object.
   * @returns {Release} An instance of the Release class.
   */
  static fromJSON(jsonParsedObject) {
    const tracks = jsonParsedObject.tracks.map(trackData => Track.fromJSON(trackData));

    return new Release(
      jsonParsedObject.artist,
      jsonParsedObject.title,
      jsonParsedObject.label,
      new Date(jsonParsedObject.date),
      tracks,
      jsonParsedObject.url,
      jsonParsedObject.about,
      jsonParsedObject.credits,
      jsonParsedObject.type,
      jsonParsedObject.coverSrc,
      jsonParsedObject.keywords
    );
  }

  /**
   * Returns release json metadata
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
   * @param {String} num
   * @param {String} title
   * @param {String} duration
   */
  constructor(num, title, duration) {
    this.num = num;
    this.title = title;
    this.duration = duration;
    this.durationText = Track.durationToSeconds(Math.trunc(this.duration));
  }

  /**
   * @param {Number} duration
   * @returns {String}
   */
  static durationToSeconds(duration) {
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;

    return minutes.toString() + ':' + padStringLeft(seconds.toString(), '0', 2);
  }

  /**
   * Create an instance of the Track class from a parsed JSON object.
   * @param {Object} jsonParsedObject - The parsed JSON object.
   * @returns {Track} An instance of the Track class.
   */
  static fromJSON(jsonParsedObject) {
    return new Track(
      jsonParsedObject.num,
      jsonParsedObject.title,
      jsonParsedObject.duration
    );
  }
}
