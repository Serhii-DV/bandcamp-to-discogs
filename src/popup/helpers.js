import { Release, ReleaseItem } from "../app/release.js";
import { getSearchDiscogsReleaseUrl } from "../discogs/modules/discogs.js";
import { disable, enable, getDataAttribute, hasDataAttribute, setDataAttribute } from "../modules/html.js";
import { generateKeyForReleaseItem } from "../modules/key-generator.js";
import { convertToAlias, isArray, isObject, isString } from "../modules/utils.js";

export function createBootstrapCheckbox(id, value, labelText, checked) {
  // Create the checkbox input element
  const checkboxInput = document.createElement("input");
  checkboxInput.classList.add("form-check-input");
  checkboxInput.type = "checkbox";
  checkboxInput.id = id;
  checkboxInput.value = value;
  checkboxInput.checked = checked;

  // Create the label element
  const label = document.createElement("label");
  label.classList.add("form-check-label");
  label.htmlFor = id;
  label.innerHTML = labelText;

  // Create the div container for the checkbox and label
  const container = document.createElement("div");
  container.classList.add("form-check");
  container.appendChild(checkboxInput);
  container.appendChild(label);

  return container;
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

/**
 * Creates a <details> element with a key-value pair.
 *
 * @param {string} key - The key (property name) of the object property.
 * @param {*} value - The value associated with the key.
 * @returns {HTMLElement} The generated <details> element representing the key-value pair.
 */
export function createKeyValueDetails(key, value) {
  const keyValueDetails = document.createElement('details');
  const summaryElement = document.createElement('summary');
  summaryElement.textContent = key;
  keyValueDetails.appendChild(summaryElement);

  const valueElement = document.createElement('div');

  if (value instanceof HTMLElement) {
    valueElement.appendChild(value);
  } else {
    valueElement.textContent = value instanceof Date ? value.toISOString() : value;
  }

  keyValueDetails.appendChild(valueElement);

  return keyValueDetails;
}

/**
 * @param {Element} button
 * @param {Array<Element>} checkboxes
 */
export function updateButtonState(button, checkboxes) {
  const anyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  button.disabled = !anyCheckboxChecked;
}

/**
 * @param {Array<ReleaseItem>|Array<Release>} releases
 * @return {Array}
 */
function transformReleaseItemsToReleaseListData(releases) {
  const data = [];

  releases.forEach(item => {
    const release = item instanceof Release ? item.releaseItem : item;
    const viewLink = getIconLinkHtml(release.url, 'box-arrow-up-right');
    const searchLink = getIconLinkHtml(getSearchDiscogsReleaseUrl(release.artist, release.title), 'search');
    data.push({
      title: `${release.artist} - ${release.title} ${viewLink} ${searchLink}`,
      value: generateKeyForReleaseItem(release),
      id: convertToAlias(release.title)
    });
  });

  return data;
}

/**
 * @param {ReleasesList} releasesList
 * @param {Array<ReleaseItem>|Array<Release>} releases
 */
export function populateReleasesList(releasesList, releases) {
  releasesList.populateData(
    transformReleaseItemsToReleaseListData(releases)
  );
}

export function getIconLinkHtml(url, icon) {
  const releaseLink = document.createElement("a");
  releaseLink.href = url;
  releaseLink.target = '_blank';
  releaseLink.innerHTML = `<b2d-icon name="${icon}"></b2d-icon>`;
  return releaseLink.outerHTML;
}

export function setBackgroundImage(element, imageUrl) {
  if (!element instanceof HTMLElement) return;
  element.style.backgroundImage = `url(${imageUrl})`;
}

export function setButtonInLoadingState(button) {
  disable(button);
  setDataAttribute(button, 'original-content', button.innerHTML);
  button.innerHTML = `
  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
  <span class="visually-hidden" role="status">Loading...</span>
`;
  return button;
}

export function removeButtonLoadingState(button) {
  enable(button);
  if (hasDataAttribute(button, 'original-content')) {
    button.innerHTML = getDataAttribute(button, 'original-content');
  }
  return button;
}
