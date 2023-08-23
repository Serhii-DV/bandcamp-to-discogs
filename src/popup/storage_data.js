import { fillReleasesForm, isValidBandcampURL } from "./helpers.js";

/**
 *
 * @param {String} tabPaneId
 * @param {String} btnClearSelector
 */
export function setupStorage(tabPaneId, btnClearSelector) {
  const tabPane = document.getElementById(tabPaneId);
  const form = document.getElementById('storageDataForm');
  const storage = chrome.storage.local;
  const btnClearStorage = document.querySelector(btnClearSelector);

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

    fillReleasesForm(releases, form);
  });

  btnClearStorage.addEventListener('click', () => {
    storage.clear();
    fillReleasesForm([], form);
  });
}
