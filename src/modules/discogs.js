import { capitalizeEachWord } from "./helpers.js";

export function releaseToCsvObject(release) {
  let tracks = [];

  release.tracks.forEach(track => {
    tracks.push(capitalizeEachWord(track.title) + ' ' + track.durationText);
  });

  let tracksStr = tracks.join("\r");

  // escape " symbols
  let notes = release.about ? release.about.replaceAll('"', '""') : '';
  let date = release.date.toISOString().split('T')[0];

  let csvObject = {
    artist: `"${release.artist}"`,
    title: `"${release.title}"`,
    label: `"${release.label}"`,
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

export function objectToHtmlTableElement(data) {
  const table = document.createElement("table");
  table.classList.add("table", "table-sm", "table-striped", "table-bordered");

  for (const [key, value] of Object.entries(data)) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("th");
    const valueCell = document.createElement("td");

    keyCell.textContent = key;
    valueCell.innerHTML = value
      .replaceAll("\n\r", "<br/>")
      .replaceAll("\r", "<br/>");

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }

  return table;
}
