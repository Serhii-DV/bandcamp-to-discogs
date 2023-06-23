import { padStringLeft } from './helpers.js';

export class Release {
  constructor(artist, title, label, releaseDate, tracks, url, about, credits, type, coverSrc) {
    this.artist = artist;
    this.title = title;
    this.label = label;
    this.date = new Date(releaseDate);
    this.tracks = tracks;
    this.url = url;
    this.about = about;
    this.credits = credits;
    this.type = type;
    this.coverSrc = coverSrc;
  }

  static fromBandcampData(TralbumData, BandData, coverSrc) {
    const { artist, current, album_release_date, url } = TralbumData;
    const { title, about, credits, type } = current;

    let tracks = TralbumData.trackinfo.map(track => new Track(
      track.track_num,
      track.title,
      track.duration
    ));

    return new Release(
      artist,
      title,
      BandData.name,
      album_release_date,
      tracks,
      url,
      about,
      credits,
      type,
      coverSrc
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
