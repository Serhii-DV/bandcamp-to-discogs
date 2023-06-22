import { eachWordFirstLetterToUpperCase } from "./helpers.js";

export function releaseToCsvObject(release) {
  let tracks = [];

  release.trackinfo.forEach(track => {
    tracks.push(eachWordFirstLetterToUpperCase(track.title) + ' ' + track.durationText);
  });

  let tracksStr = tracks.join("\r");

  // escape " symbols
  let notes = release.about ? release.about.replaceAll('"', '""') : '';
  let date = release.date.toISOString().split('T')[0];

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
