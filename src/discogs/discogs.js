import { DiscogsCsv } from "./discogs-csv.js";
import { isArray, isObject, isString } from "../modules/helpers.js";
import { Release } from "../app/release.js";

/**
 * @param {Release} release
 * @returns {Object}
 */
export function releaseToCsvObject(release) {
  return DiscogsCsv.fromRelease(release).toCsvObject();
}

export function getSearchDiscogsArtistUrl(artist) {
  return `https://www.discogs.com/search?q=${encodeURIComponent(artist)}&type=artist`;
}

export function getSearchDiscogsReleaseUrl(artist, release) {
  return `https://www.discogs.com/search?q=${encodeURIComponent(artist)}+${encodeURIComponent(release)}&type=release`;
}

/**
 * Converts a JavaScript object to an HTML element representing a table.
 * @param {Object} data - The JavaScript object to convert.
 * @returns {Node} - The HTML element representing the converted table.
 */
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
      valueCell.innerHTML = value
        .map(item => (isString(item) ? item : objectToHtmlElement(item).innerHTML))
        .join(", ");
    } else {
      valueCell.innerHTML = isString(value)
        ? value.replace(/[\r\n]+/g, "<br/>")
        : value;
    }

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }

  return table;
}
