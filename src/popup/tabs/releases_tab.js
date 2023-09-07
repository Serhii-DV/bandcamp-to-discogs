import { openTabs } from "../../modules/chrome.js";
import { findMissingKeysInStorage, findReleasesInStorage } from "../../modules/storage.js";
import { createElementFromHTML, transformReleasesToReleasesListData } from "../helpers.js";
import { downloadReleasesCsv, setupDownloadReleasesAsCsv } from "./download_tab.js";

export function setupReleasesTab(releaseList, bgImageSrc, btnNavDownload) {
  const imgReleaseCover = document.getElementById('release-cover')
  imgReleaseCover.src = bgImageSrc;

  const releasesList = document.querySelector('#releasesTabLIst');
  setupReleasesList(releasesList, releaseList, btnNavDownload);
}

/**
 * @param {ReleasesList} releasesList
 * @param {Array} releases
 * @param {Element} btnNavDownload
 */
function setupReleasesList(releasesList, items, btnNavDownload) {
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

  btnDownload.addEventListener("click", async () => {
    const checkedUrls = releasesList.getSelectedValues();

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
    setupDownloadReleasesAsCsv(btnDownload, releases);
    downloadReleasesCsv(releases);
  });
}
