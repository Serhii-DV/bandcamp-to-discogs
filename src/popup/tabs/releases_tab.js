import { openTabs } from "../../modules/chrome.js";
import { findMissingKeysInStorage, findReleasesInStorage } from "../../modules/storage.js";
import { createElementFromHTML, transformReleasesToReleasesListData } from "../helpers.js";
import { downloadReleasesCsv, setupDownloadReleasesAsCsv } from "./download_tab.js";

export function setupReleasesTab(releaseList, bgImageSrc, releaseForm, btnSubmitReleases, btnDownload) {
  const imgReleaseCover = document.getElementById('release-cover')
  imgReleaseCover.src = bgImageSrc;

  const releasesList = document.querySelector('#releasesTabLIst');
  setupReleasesList(releasesList, releaseList);

  btnSubmitReleases.addEventListener("click", async () => {
    const checkedCheckboxes = Array.from(releaseForm.querySelectorAll('input[type="checkbox"]:checked'));
    const checkedUrls = checkedCheckboxes.map((checkbox) => checkbox.value);

    findMissingKeysInStorage(checkedUrls, missingKeys => {
      openTabs(missingKeys, (tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: waitForBandcampData
        }).then(() => {});
      }).then(() => {
        setTimeout(() => {
          setupDownloadButton(checkedUrls, btnDownload);
        }, 3000);
      });
    });
  });
}

function waitForBandcampData() {
  setTimeout(() => window.close(), 1000);
}

function setupDownloadButton(urls, btnDownload) {
  // Read data from the storage
  findReleasesInStorage(urls, releases => {
    console.log('findReleasesInStorage');
    console.log(releases);
    setupDownloadReleasesAsCsv(btnDownload, releases);
    downloadReleasesCsv(releases);
  });
}


/**
 * @param {ReleasesList} releasesList
 * @param {Array} releases
 */
function setupReleasesList(releasesList, items) {
  releasesList.populateData(
    transformReleasesToReleasesListData(items)
  );

  const btnDownload = createElementFromHTML(`
<button id="submitBandcampReleases" type="button" class="btn btn-primary btn-sm">
  <b2d-icon name="download"></b2d-icon>
  Download as Discogs CSV
</button>
`);

  // setupExportButton(btnExport, releasesList.getCheckboxes());
  // setupClearSelectedButton(btnClearSelected, releasesList.getCheckboxes());
  // setupClearAllButton(btnClearAll);

  releasesList.appendButton(btnDownload);
}
