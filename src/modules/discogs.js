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

export function objectToHtmlElement(data) {
  if (!isObject(data)) {
    return document.createTextNode(data);
  }

  const table = document.createElement("table");
  table.classList.add("table", "table-sm", "table-striped", "table-bordered");

  for (const [key, value] of Object.entries(data)) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("th");
    const valueCell = document.createElement("td");

    keyCell.classList.add("w-25");
    valueCell.classList.add("w-auto");

    keyCell.textContent = key;

    if (isObject(value)) {
      valueCell.appendChild(objectToHtmlElement(value));
    } else if (isArray(value)) {
      value.forEach(item => {
        valueCell.appendChild(objectToHtmlElement(item));
      });
    } else {
      valueCell.innerHTML = typeof value === 'string'
        ? value
          .replaceAll("\n\r", "<br/>")
          .replaceAll("\r", "<br/>")
        : value;
    }

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }

  return table;
}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function isArray(value) {
  return Array.isArray(value);
}
