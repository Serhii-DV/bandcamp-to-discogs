import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectsToCsv } from "../../modules/csv.js";
import { createElementFromHTML, hasDataAttribute, setDataAttribute } from "../../modules/html.js";
import { clearStorage, clearStorageByKey, findAllReleasesInStorage, findReleasesInStorage } from "../../modules/storage.js";
import { removeButtonLoadingState, setButtonInLoadingState, transformReleasesToReleasesListData } from "../helpers.js";

/**
 * @param {Element} btnDownloadCsv
 */
export function setupStorageTab(tab, btnDownloadCsv) {
  const releasesList = document.querySelector('#storageReleasesLIst');

  if (!hasDataAttribute(tab, 'buttons-initialized')) {
    setupReleasesList(tab, releasesList, btnDownloadCsv);
    setDataAttribute(tab, 'buttons-initialized');
  }

  updateReleasesListData(releasesList);
}

function updateReleasesListData(releasesList) {
  findAllReleasesInStorage((releases) => {
    releasesList.populateData(
      transformReleasesToReleasesListData(releases)
    );
  });
}

/**
 * @param {Element} tab
 * @param {ReleasesList} releasesList
 * @param {Element} btnDownloadCsv
 */
function setupReleasesList(tab, releasesList, btnDownloadCsv) {
  const btnClearSelected = createElementFromHTML(`
<button id="storageDataClearSelected" type="button" class="btn btn-danger" data-status-update title="Clear selected storage data">
  <b2d-icon name="database-dash"></b2d-icon>
</button>`);
  const btnClearAll = createElementFromHTML(`
<button id="storageDataClear" type="button" class="btn btn-dark" title="Remove all items from the storage" data-bs-toggle="modal" data-bs-target="#storageTabDeleteAllModal">
  <b2d-icon name="database-x"></b2d-icon>
</button>`);

  const downloadCsvFile = (event) => {
    const button = event.target;
    setButtonInLoadingState(button);
    const selectedValues = releasesList.getSelectedValues();

    findReleasesInStorage(selectedValues, releases => {
      const firstRelease = releases[0];
      const csvObjects = releases.map(release => DiscogsCsv.fromRelease(release).toCsvObject());
      const csv = objectsToCsv(csvObjects);
      downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
      removeButtonLoadingState(button);
    });
  }

  btnDownloadCsv.addEventListener('click', downloadCsvFile);
  releasesList.addStateButton(btnDownloadCsv);

  btnClearSelected.addEventListener('click', () => {
    const selectedValues = releasesList.getSelectedValues();
    clearStorageByKey(selectedValues, () => {
      updateReleasesListData(releasesList);
    });
  });

  tab.querySelector('#storageTabDeleteAllModal_btnYes').addEventListener('click', () => {
    clearStorage();
    updateReleasesListData(releasesList);
  });

  releasesList.appendButton(btnClearSelected, btnClearAll);
  releasesList.addStatusElement(
    document.getElementById('selectedStatusInfo'),
    document.getElementById('viewedStatusInfo')
  );
}
