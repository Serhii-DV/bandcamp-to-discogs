import {
  createElementFromHTML,
  hasDataAttribute,
  setDataAttribute
} from '../../utils/html';
import {
  clearStorage,
  clearStorageByKey,
  getAllReleases,
  getReleasesByUuids
} from '../../utils/storage';
import {
  populateReleasesList,
  removeButtonLoadingState,
  setButtonInLoadingState
} from '../helpers.js';
import config from '../../config.js';
import { loadDiscogsGenres } from '../../discogs/modules/genres.js';
import { loadKeywordMapping } from '../../bandcamp/modules/mapping.js';
import { downloadReleasesCsv } from './download_tab.js';

export function setupHistoryTab(tab) {
  const releasesListComponent = getReleasesList();

  if (!hasDataAttribute(tab, 'buttons-initialized')) {
    setupReleasesListComponent(tab, releasesListComponent);
    setDataAttribute(tab, 'buttons-initialized');
  }

  loadDiscogsGenres(config.genres_url).then(() => {
    loadKeywordMapping(config.keyword_mapping_url).then(() => {
      updateReleasesListData(releasesListComponent);
    });
  });
}

export function setHistoryTabSearchValue(searchValue) {
  const releasesList = getReleasesList();
  releasesList.setSearchValue(searchValue);
}

/**
 * @returns {ReleasesList}
 */
function getReleasesList() {
  return document.getElementById('historyReleasesList');
}

function updateReleasesListData(releasesList) {
  getAllReleases().then((releases) => {
    populateReleasesList(releasesList, releases);
  });
}

/**
 * @param {Element} tab
 * @param {ReleasesList} releasesListComponent
 */
function setupReleasesListComponent(tab, releasesListComponent) {
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
    const selectedUuids = releasesListComponent.getSelectedValues();

    setButtonInLoadingState(button);
    getReleasesByUuids(selectedUuids).then((releases) => {
      downloadReleasesCsv(releases);
      removeButtonLoadingState(button);
    });
  };

  btnDownloadCsv.addEventListener('click', downloadCsvFile);
  releasesListComponent.addStateButton(btnDownloadCsv);

  btnClearSelected.addEventListener('click', () => {
    const selectedValues = releasesListComponent.getSelectedValues();
    clearStorageByKey(selectedValues, () => {
      updateReleasesListData(releasesListComponent);
    });
  });

  tab
    .querySelector('#historyTabDeleteAllModal_btnYes')
    .addEventListener('click', () => {
      clearStorage();
      updateReleasesListData(releasesListComponent);
    });

  releasesListComponent.appendButton(
    btnDownloadCsv,
    btnClearSelected,
    btnClearAll
  );
  releasesListComponent.addStatusElement(
    document.getElementById('selectedStatusInfo'),
    document.getElementById('viewedStatusInfo')
  );
}
