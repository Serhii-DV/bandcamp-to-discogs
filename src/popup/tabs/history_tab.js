import { DiscogsCsv } from '../../discogs/app/discogs-csv.js';
import { downloadCsv, objectsToCsv } from '../../utils/csv.ts';
import {
  createElementFromHTML,
  hasDataAttribute,
  setDataAttribute
} from '../../utils/html';
import {
  clearStorage,
  clearStorageByKey,
  findAllReleases,
  findReleasesByUrls
} from '../../utils/storage';
import {
  populateReleasesList,
  removeButtonLoadingState,
  setButtonInLoadingState
} from '../helpers.js';
import config from '../../config.js';
import { loadDiscogsGenres } from '../../discogs/modules/genres.js';
import { loadKeywordMapping } from '../../bandcamp/modules/mapping.js';

export function setupHistoryTab(tab) {
  const releasesList = getReleasesList();

  if (!hasDataAttribute(tab, 'buttons-initialized')) {
    setupReleasesList(tab, releasesList);
    setDataAttribute(tab, 'buttons-initialized');
  }

  loadDiscogsGenres(config.genres_url).then(() => {
    loadKeywordMapping(config.keyword_mapping_url).then(() => {
      updateReleasesListData(releasesList);
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
  findAllReleases().then((releases) => {
    populateReleasesList(releasesList, releases);
  });
}

/**
 * @param {Element} tab
 * @param {ReleasesList} releasesList
 */
function setupReleasesList(tab, releasesList) {
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
    setButtonInLoadingState(button);

    const bcLinks = releasesList.querySelectorAll(
      '.release-item.table-active .link-bandcamp-url'
    );
    const checkedUrls = Array.from(bcLinks).map((link) =>
      link.getAttribute('href')
    );

    findReleasesByUrls(checkedUrls, (releases) => {
      const firstRelease = releases[0];
      const csvObjects = releases.map((release) =>
        DiscogsCsv.fromRelease(release).toCsvObject()
      );
      const csv = objectsToCsv(csvObjects);
      downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
      removeButtonLoadingState(button);
    });
  };

  btnDownloadCsv.addEventListener('click', downloadCsvFile);
  releasesList.addStateButton(btnDownloadCsv);

  btnClearSelected.addEventListener('click', () => {
    const selectedValues = releasesList.getSelectedValues();
    clearStorageByKey(selectedValues, () => {
      updateReleasesListData(releasesList);
    });
  });

  tab
    .querySelector('#historyTabDeleteAllModal_btnYes')
    .addEventListener('click', () => {
      clearStorage();
      updateReleasesListData(releasesList);
    });

  releasesList.appendButton(btnDownloadCsv, btnClearSelected, btnClearAll);
  releasesList.addStatusElement(
    document.getElementById('selectedStatusInfo'),
    document.getElementById('viewedStatusInfo')
  );
}
