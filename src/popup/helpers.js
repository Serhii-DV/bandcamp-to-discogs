import { Release } from '../app/release.js';
import { Metadata } from '../discogs/app/metadata.js';
import {
  chromeSendMessageToCurrentTab,
  getCurrentTabUrl,
  openTabsAndClose
} from '../utils/chrome';
import {
  createIconLink,
  disable,
  enable,
  getDataAttribute,
  hasDataAttribute,
  setDataAttribute
} from '../utils/html';
import { getOwnProperty, isArray, isObject, isString } from '../utils/utils';
import { isValidDiscogsReleaseEditUrl } from '../discogs/app/utils.js';
import { getHistoryData, getReleaseByUuid } from '../utils/storage';
import { showReleaseCardTab } from './modules/main';

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
 * @param {ReleaseItem} releaseItem
 * @returns {HTMLAnchorElement}
 */
const createViewLink = (releaseItem) =>
  createIconLink({
    href: '#view',
    iconDefault: 'card-text',
    className: 'link-view',
    title: 'View release detailed info',
    onClick: () => {
      getReleaseByUuid(releaseItem.uuid).then((release) => {
        if (release instanceof Release) {
          showReleaseCardTab(release);
        } else {
          openTabsAndClose([releaseItem.url]).then(() => {
            setTimeout(() => {
              getReleaseByUuid(releaseItem.uuid).then((release) => {
                // Show release card
                showReleaseCardTab(release);
              });
            }, 3000);
          });
        }
      });
      return true;
    }
  });

/**
 * @param {Release} release
 * @returns {HTMLAnchorElement}
 */
const createApplyMetadataLink = (release) =>
  createIconLink({
    title: 'Load release hints into the current Discogs release draft',
    iconDefault: 'file-arrow-down',
    iconOnClick: 'file-arrow-down-fill',
    onClick: () => {
      const metadata = Metadata.fromRelease(release);
      chromeSendMessageToCurrentTab({
        type: 'B2D_METADATA',
        metadata
      });

      return true;
    }
  });

/**
 * @param {string} currentTabUrl
 * @param {Array<ReleaseItem>|Array<Release>} releases
 * @param {import('../utils/storage').HistoryData}
 * @return {Array}
 */
function transformReleaseItemsToReleaseListData(
  currentTabUrl,
  releases,
  historyData
) {
  const data = [];
  const isDiscogsEditPage = isValidDiscogsReleaseEditUrl(currentTabUrl);

  releases.forEach((item) => {
    const isRelease = item instanceof Release;
    const releaseItem = isRelease ? item.releaseItem : item;
    const history = getOwnProperty(historyData, releaseItem.uuid, []);
    const controls = [createViewLink(releaseItem)];

    if (isDiscogsEditPage && isRelease) {
      controls.push(createApplyMetadataLink(item));
    }

    data.push({
      releaseItem,
      history,
      controls
    });
  });

  return data;
}

/**
 * @param {ReleasesList} releasesList
 * @param {Array<ReleaseItem>|Array<Release>} releases
 * @param {boolean} sortByLatestDateVisited
 */
export function populateReleasesList(
  releasesList,
  releases,
  sortByLatestDateVisited
) {
  getCurrentTabUrl().then((url) => {
    if (!url) return;

    getHistoryData().then((historyData) => {
      releasesList.populateData(
        transformReleaseItemsToReleaseListData(url, releases, historyData)
      );

      if (sortByLatestDateVisited) {
        releasesList.sortByLatestDateVisited();
      }
    });
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
