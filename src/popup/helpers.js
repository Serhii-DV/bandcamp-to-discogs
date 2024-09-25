import { Release } from '../app/release.js';
import { Metadata } from '../discogs/app/metadata.js';
import { getSearchDiscogsReleaseUrl } from '../discogs/modules/discogs.js';
import {
  chromeSendMessageToCurrentTab,
  getCurrentTabUrl
} from '../utils/chrome';
import {
  createIconLink,
  disable,
  enable,
  getDataAttribute,
  hasDataAttribute,
  setDataAttribute
} from '../utils/html';
import { isArray, isObject, isString } from '../utils/utils';
import { isValidDiscogsReleaseEditUrl } from '../discogs/app/utils.js';

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

/**
 * @param {string} currentTabUrl
 * @param {Array<ReleaseItem>|Array<Release>} releases
 * @return {Array}
 */
function transformReleaseItemsToReleaseListData(currentTabUrl, releases) {
  const data = [];

  releases.forEach((item) => {
    const releaseItem = item instanceof Release ? item.releaseItem : item;
    const viewLink = createIconLink({
      href: releaseItem.url,
      iconDefault: 'box-arrow-up-right',
      className: 'link-bandcamp-url',
      title: 'View bandcamp release'
    });
    const searchLink = createIconLink({
      href: getSearchDiscogsReleaseUrl(releaseItem.artist, releaseItem.title),
      iconDefault: 'search',
      className: 'link-discogs-search',
      title: 'Search release on Discogs'
    });
    const controls = [viewLink, searchLink];

    if (
      isValidDiscogsReleaseEditUrl(currentTabUrl) &&
      item instanceof Release
    ) {
      const applyMetadataLink = createIconLink({
        title: 'Load release hints into the current Discogs release draft',
        iconDefault: 'file-arrow-down',
        iconOnClick: 'file-arrow-down-fill',
        onClick: () => {
          const metadata = Metadata.fromRelease(item);
          chromeSendMessageToCurrentTab({
            type: 'B2D_METADATA',
            metadata
          });

          return true;
        }
      });
      controls.push(applyMetadataLink);
    }

    data.push({
      releaseItem,
      controls
    });
  });

  return data;
}

/**
 * @param {ReleasesList} releasesList
 * @param {Array<ReleaseItem>|Array<Release>} releases
 */
export function populateReleasesList(releasesList, releases) {
  getCurrentTabUrl().then((url) => {
    if (!url) return;

    releasesList.populateData(
      transformReleaseItemsToReleaseListData(url, releases)
    );
  });
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
