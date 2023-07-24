import { DiscogsCsv } from "./discogs-csv.js";
import { isArray, isObject, isString } from "../modules/utils.js";
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
  if (!isObject(data) && !isArray(data)) {
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
        .map(item => (isString(item) ? item : objectToHtmlElement(item).outerHTML))
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

/**
 * Converts an object into a nested HTML <details> element with key-value pairs.
 *
 * @param {Object} obj - The input object to be converted into a details element.
 * @param {string} [title=''] - An optional title for the top-level <summary> element.
 * @returns {HTMLElement} The generated <details> element representing the object's structure.
 */
export function objectToDetailsElement(obj, title = '') {
  const detailsElement = document.createElement('details');
  const summaryElement = document.createElement('summary');
  summaryElement.textContent = title;
  detailsElement.appendChild(summaryElement);

  /**
   * Creates a <details> element with a key-value pair.
   *
   * @param {string} key - The key (property name) of the object property.
   * @param {*} value - The value associated with the key.
   * @returns {HTMLElement} The generated <details> element representing the key-value pair.
   */
  const createKeyValueDetails = (key, value) => {
    const keyValueDetails = document.createElement('details');
    const summaryElement = document.createElement('summary');
    summaryElement.textContent = key;
    keyValueDetails.appendChild(summaryElement);

    const valueElement = document.createElement('div');
    valueElement.textContent = value instanceof Date ? value.toISOString() : value;
    keyValueDetails.appendChild(valueElement);

    return keyValueDetails;
  };

  Object.entries(obj).forEach(([key, value]) => {
    if ((isObject(value) || isArray(value)) && value !== null) {
      const nestedDetails = objectToDetailsElement(value, key);
      detailsElement.appendChild(nestedDetails);
    } else {
      const keyValueDetails = createKeyValueDetails(key, value);
      detailsElement.appendChild(keyValueDetails);
    }
  });

  return detailsElement;
}
