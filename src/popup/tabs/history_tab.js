import {
  createElementFromHTML,
  hasDataAttribute,
  onClick,
  setDataAttribute
} from '../../utils/html';
import {
  removeButtonLoadingState,
  setButtonInLoadingState
} from '../helpers.js';
import { downloadReleasesCsv } from './download_tab.js';
import {
  bandcampReleasesAndArtistsHistorySearch,
  historyItemsToArtistOrReleaseItems
} from '../../bandcamp/modules/history';
import { populateReleasesList } from '../modules/releasesList';

export function setupHistoryTab(tab, tabContent, storage) {
  onClick(tab, () => {
    const releasesListElement = getReleasesListElement();

    if (!hasDataAttribute(tabContent, 'buttons-initialized')) {
      setupReleasesListComponent(tabContent, releasesListElement, storage);
      setDataAttribute(tabContent, 'buttons-initialized');
    }

    updateReleasesListData(releasesListElement);
  });
}

export function setHistoryTabSearchValue(searchValue) {
  const releasesListElement = getReleasesListElement();
  releasesListElement.setSearchValue(searchValue);
}

/**
 * @returns {ReleasesList}
 */
function getReleasesListElement() {
  return document.getElementById('historyReleasesList');
}

function updateReleasesListData(releasesListElement) {
  bandcampReleasesAndArtistsHistorySearch((results) => {
    const releaseItems = historyItemsToArtistOrReleaseItems(results);
    populateReleasesList(releasesListElement, releaseItems, true);
  }, 500);
}

/**
 * @param {Element} tab
 * @param {ReleasesList} releasesListElement
 * @param {Storage} storage
 */
function setupReleasesListComponent(tab, releasesListElement, storage) {
  const btnDownloadCsv = createElementFromHTML(`
<button id="downloadHistory" class="btn btn-primary rounded-0" type="button" title="Download selected releases from the history as Discogs CSV file" disabled>
  <b2d-icon name="download"></b2d-icon>
</button>`);
  const btnClearSelected = createElementFromHTML(`
<button id="historyDataClearSelected" type="button" class="btn btn-danger" data-status-update title="Clear selected history">
  <b2d-icon name="database-dash"></b2d-icon>
</button>`);
  const btnClearAll = createElementFromHTML(`
<button id="historyDataClear" type="button" class="btn btn-dark" title="Remove all items from the history" data-bs-toggle="modal" data-bs-target="#historyTabDeleteAllModal">
  <b2d-icon name="database-x"></b2d-icon>
</button>`);

  const downloadCsvFile = (event) => {
    const button = event.target;
    const selectedUuids = releasesListElement.getSelectedValues();

    setButtonInLoadingState(button);
    storage.getByUuids(selectedUuids).then((releases) => {
      downloadReleasesCsv(releases);
      removeButtonLoadingState(button);
    });
  };

  btnDownloadCsv.addEventListener('click', downloadCsvFile);
  releasesListElement.addStateButton(btnDownloadCsv);

  btnClearSelected.addEventListener('click', () => {
    const selectedUuids = releasesListElement.getSelectedValues();
    storage.remove(selectedUuids).then(() => {
      updateReleasesListData(releasesListElement);
    });
  });

  tab
    .querySelector('#historyTabDeleteAllModal_btnYes')
    .addEventListener('click', () => {
      storage.clear().then(() => {
        updateReleasesListData(releasesListElement);
      });
    });

  releasesListElement.appendButton(
    btnDownloadCsv,
    btnClearSelected,
    btnClearAll
  );
  releasesListElement.addStatusElement(
    document.getElementById('selectedStatusInfo'),
    document.getElementById('viewedStatusInfo')
  );
}
