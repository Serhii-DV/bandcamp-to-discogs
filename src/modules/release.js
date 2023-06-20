import {durationToSeconds} from './helpers.js';

export class Release {
  constructor(release) {
    this.artist = release.artist;
    this.title = release.title;
    this.date = new Date(release.release_date);
    this.trackinfo = [];

    release.trackinfo.forEach(track => {
      this.trackinfo.push(new Track(track));
    });

    this.url = release.url;
    this.about = release.about;
    this.credits = release.credits;
    this.type = release.type;
    this.coverSrc = release.coverSrc;
  }
}

export class Track {
  constructor(data) {
    this.num = data.num;
    this.title = data.title;
    this.duration = data.duration;
    this.durationText = durationToSeconds(Math.trunc(this.duration));
  }
}

export function releaseToCsvObject(release) {
  let tracks = [];

  release.trackinfo.forEach(track => {
    tracks.push(track.title + ' ' + track.durationText);
  });

  let tracksStr = tracks.join("\r");

  // escape " symbols
  let notes = release.about ? release.about.replaceAll('"', '""') : '';
  let date = [
    release.date.getFullYear(),
    release.date.getMonth().toString().padStart(2, 0),
    release.date.getDate().toString().padStart(2, 0)
  ].join('-');

  let csvObject = {
    artist: release.artist,
    title: `"${release.title}"`,
    label: `Not On Label (${release.artist} Self-released)`,
    catno: 'none',
    format: 'File',
    genre: 'Electronic',
    style: '"Industrial, Dark Ambient"',
    tracks: `"${tracksStr}"`,
    notes: `"${notes}"`,
    date: date,
    images: release.coverSrc.big
  };

  return csvObject;
}
