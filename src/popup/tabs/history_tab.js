import {
  createElementFromHTML,
  hasDataAttribute,
  setDataAttribute
} from '../../utils/html';
import {
  clearStorage,
  clearStorageByKey,
  getReleasesByUuids
} from '../../utils/storage';
import {
  removeButtonLoadingState,
  setButtonInLoadingState
} from '../helpers.js';
import config from '../../config.js';
import { loadDiscogsGenres } from '../../discogs/modules/genres.js';
import { loadKeywordMapping } from '../../bandcamp/modules/mapping.js';
import { downloadReleasesCsv } from './download_tab.js';
import {
  bandcampReleasesAndArtistsHistorySearch,
  historyItemsToArtistOrReleaseItems
} from '../../bandcamp/modules/history';
import { populateReleasesList } from '../modules/releasesList';

export function setupHistoryTab(tab) {
  const releasesListElement = getReleasesListElement();

  if (!hasDataAttribute(tab, 'buttons-initialized')) {
    setupReleasesListComponent(tab, releasesListElement);
    setDataAttribute(tab, 'buttons-initialized');
  }

  loadDiscogsGenres(config.genres_url).then(() => {
    loadKeywordMapping(config.keyword_mapping_url).then(() => {
      updateReleasesListData(releasesListElement);
    });
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
 */
function setupReleasesListComponent(tab, releasesListElement) {
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
    getReleasesByUuids(selectedUuids).then((releases) => {
      downloadReleasesCsv(releases);
      removeButtonLoadingState(button);
    });
  };

  btnDownloadCsv.addEventListener('click', downloadCsvFile);
  releasesListElement.addStateButton(btnDownloadCsv);

  btnClearSelected.addEventListener('click', () => {
    const selectedValues = releasesListElement.getSelectedValues();
    clearStorageByKey(selectedValues, () => {
      updateReleasesListData(releasesListElement);
    });
  });

  tab
    .querySelector('#historyTabDeleteAllModal_btnYes')
    .addEventListener('click', () => {
      clearStorage();
      updateReleasesListData(releasesListElement);
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
