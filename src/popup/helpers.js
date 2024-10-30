import {
  disable,
  enable,
  getDataAttribute,
  hasDataAttribute,
  setDataAttribute
} from '../utils/html';
import { isArray, isObject, isString } from '../utils/utils';

/**
 * Converts a JavaScript object to an HTML element representing a table.
 * @param {Object} data - The JavaScript object to convert.
 * @returns {Node} - The HTML element representing the converted table.
 */
export function objectToHtmlElement(data) {
  if (!isObject(data) && !isArray(data)) {
    return document.createTextNode(data);
  }

  const table = document.createElement('table');
  table.classList.add('table', 'table-sm', 'table-striped', 'table-bordered');

  for (const [key, value] of Object.entries(data)) {
    const row = document.createElement('tr');
    const keyCell = document.createElement('th');
    const valueCell = document.createElement('td');

    keyCell.classList.add('w-25');
    valueCell.classList.add('w-auto');

    keyCell.textContent = key;

    if (isObject(value)) {
      valueCell.appendChild(objectToHtmlElement(value));
    } else if (isArray(value)) {
      valueCell.innerHTML = value
        .map((item) =>
          isString(item) ? item : objectToHtmlElement(item).outerHTML
        )
        .join(', ');
    } else {
      valueCell.innerHTML = isString(value)
        ? value.replace(/[\r\n]+/g, '<br/>')
        : value;
    }

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }

  return table;
}

export function setBackgroundImage(element, imageUrl) {
  if ((!element) instanceof HTMLElement) return;
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
