import { padStringLeft } from './helpers.js';

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
    const { artist, current, album_release_date, url } = TralbumData;
    const { title, about, credits, type } = current;
    const { keywords} = SchemaData;

    let tracks = TralbumData.trackinfo.map(track => new Track(
      track.track_num,
      track.title,
      track.duration
    ));

    return new Release(
      artist,
      title,
      BandData.name,
      new Date(album_release_date),
      tracks,
      url,
      about,
      credits,
      type,
      coverSrc,
      keywords
    );
  }
}

export class Track {
  constructor(num, title, duration) {
    this.num = num;
    this.title = title;
    this.duration = duration;
    this.durationText = Track.durationToSeconds(Math.trunc(this.duration));
  }

  static durationToSeconds(duration) {
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;

    return padStringLeft(minutes, '0', 2) + ':' + padStringLeft(seconds, '0', 2);
  }
}
