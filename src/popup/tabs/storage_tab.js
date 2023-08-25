import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectsToCsv } from "../../modules/csv.js";
import { getReleasesFromStorage } from "../../modules/storage.js";
import { fillReleasesForm, isValidBandcampURL } from "../helpers.js";

/**
 * @param {Element} form
 * @param {Element} btnExport
 * @param {Element} btnClear
 */
export function setupStorage(form, btnExport, btnClear) {
  const storage = chrome.storage.local;

  storage.get(null, (data) => {
    // Display the data in the console
    console.log(data);

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

  btnClear.addEventListener('click', () => {
    storage.clear();
    updateReleases([]);
  });

  function updateReleases(releases) {
    fillReleasesForm(releases, form);
    setupExportButton(form, btnExport);
  }
}

/**
 *
 * @param {Element} form
 * @param {Element} btnExport
 */
function setupExportButton(form, btnExport) {
  const checkboxes = document.querySelectorAll('#storageDataForm input[type="checkbox"]');
  checkboxes.forEach(checkbox => checkbox.addEventListener('click', updateButtonState));

  updateButtonState();

  function updateButtonState() {
    const anyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    btnExport.disabled = !anyCheckboxChecked;
  }

  btnExport.addEventListener('click', () => {
    const selectedValues = getSelectedValues(checkboxes);

    getReleasesFromStorage(selectedValues, releases => {
      const firstRelease = releases[0];
      const csvObjects = releases.map(release => DiscogsCsv.fromRelease(release).toCsvObject());
      const csv = objectsToCsv(csvObjects);
      downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
    });
  });
}

function getSelectedValues(checkboxes) {
  return Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
}
