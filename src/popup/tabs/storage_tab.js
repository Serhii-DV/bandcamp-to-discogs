import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectsToCsv } from "../../modules/csv.js";
import { findReleasesInStorage } from "../../modules/storage.js";
import { createElementFromHTML, isValidBandcampURL, transformReleasesToReleasesListData } from "../helpers.js";

/**
 * @param {Element} form
 * @param {Element} btnExport
 * @param {Element} btnClear
 */
export function setupStorage(form, btnExport, btnClear) {
  const storage = chrome.storage.local;

  storage.get(null, (data) => {
    // Display the data in the console
    console.log('storage.get', data);

    const releases = [];

    for (const key in data) {
      if (!isValidBandcampURL(key) || !data.hasOwnProperty(key)) {
        continue;
      }

      const releaseObject = data[key];

      if (releaseObject.release) {
        releases.push(releaseObject.release);
      }
    }

    updateReleases(releases);
  });

  const releasesList = document.querySelector('#storageReleasesLIst');

  function updateReleases(releases) {
    setupReleasesList(releasesList, releases);
  }
}

function setupClearAllButton(button) {
  button.addEventListener('click', () => {
    storage.clear();
    updateReleases([]);
  });
}

/**
 * @param {ReleasesList} releasesList
 * @param {Array} releases
 */
function setupReleasesList(releasesList, releases) {
  releasesList.populateData(
    transformReleasesToReleasesListData(releases)
  );

  const btnExport = createElementFromHTML('<button id="storageExport" type="button" class="btn btn-primary" title="Export selected releases to Discogs CSV">Export to CSV</button>');
  const btnClearSelected = createElementFromHTML('<button id="storageDataClearSelected" type="button" class="btn btn-warning" title="Clear selected storage data">Clear selected</button>');
  const btnClearAll = createElementFromHTML('<button id="storageDataClear" type="button" class="btn btn-warning" title="Clear storage data">Clear all</button>');

  function downloadCsvFile() {
    const selectedValues = releasesList.getSelectedValues();

    findReleasesInStorage(selectedValues, releases => {
      const firstRelease = releases[0];
      const csvObjects = releases.map(release => DiscogsCsv.fromRelease(release).toCsvObject());
      const csv = objectsToCsv(csvObjects);
      downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
    });
  }

  releasesList.setupButton(btnExport, downloadCsvFile);
  releasesList.setupButton(btnClearSelected, () => {
    console.log('Clear selected releases');
  });

  setupClearAllButton(btnClearAll);

  releasesList.appendButton(btnExport, btnClearSelected, btnClearAll);
}
