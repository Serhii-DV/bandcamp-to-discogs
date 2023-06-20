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
