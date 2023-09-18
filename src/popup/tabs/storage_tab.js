import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectsToCsv } from "../../modules/csv.js";
import { clearStorage, clearStorageByKey, findAllReleasesInStorage, findReleasesInStorage } from "../../modules/storage.js";
import { createElementFromHTML, transformReleasesToReleasesListData } from "../helpers.js";

/**
 * @param {Element} form
 * @param {Element} btnExport
 * @param {Element} btnClear
 */
export function setupStorageTab() {
  const releasesList = document.querySelector('#storageReleasesLIst');
  setupReleasesList(releasesList);
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
 * @param {ReleasesList} releasesList
 * @param {Array} releases
 */
function setupReleasesList(releasesList, releases) {
  const btnExport = createElementFromHTML(`
<button id="storageExport" type="button" class="btn btn-primary" data-status-update title="Download selected releases as Discogs Draft CSV">
  <b2d-icon name="download"></b2d-icon>
  Save to CSV
</button>`);
  const btnClearSelected = createElementFromHTML(`
<button id="storageDataClearSelected" type="button" class="btn" data-status-update title="Clear selected storage data">
  <b2d-icon name="database-dash"></b2d-icon>
</button>`);
  const btnClearAll = createElementFromHTML(`
<button id="storageDataClear" type="button" class="btn btn-danger" title="Remove all items from the storage">
  <b2d-icon name="database-x"></b2d-icon>
</button>`);

  function downloadCsvFile() {
    const selectedValues = releasesList.getSelectedValues();

    findReleasesInStorage(selectedValues, releases => {
      const firstRelease = releases[0];
      const csvObjects = releases.map(release => DiscogsCsv.fromRelease(release).toCsvObject());
      const csv = objectsToCsv(csvObjects);
      downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
    });
  }

  btnExport.addEventListener('click', downloadCsvFile);
  btnClearSelected.addEventListener('click', () => {
    const selectedValues = releasesList.getSelectedValues();
    clearStorageByKey(selectedValues, () => {
      updateReleasesListData(releasesList);
    });
  });
  btnClearAll.addEventListener('click', () => {
    clearStorage();
    updateReleasesListData(releasesList);
  });

  releasesList.appendButton(btnExport, btnClearSelected, btnClearAll);
}
