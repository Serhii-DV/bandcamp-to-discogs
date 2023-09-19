import { openTabs } from "../../modules/chrome.js";
import { findMissingKeysInStorage, findReleasesInStorage } from "../../modules/storage.js";
import { createElementFromHTML, setBackgroundImage, transformReleasesToReleasesListData } from "../helpers.js";
import { downloadReleasesCsv, setupBtnToDownloadReleasesAsCsv } from "./download_tab.js";

export function setupReleasesTab(releaseList, bgImageSrc, btnNavDownload) {
  setBackgroundImage(document.querySelector('.bg-image'), bgImageSrc);
  const releasesList = document.querySelector('#releasesTabLIst');
  releasesList.populateData(
    transformReleasesToReleasesListData(releaseList)
  );
  setupReleasesList(releasesList, releaseList, btnNavDownload);
}

/**
 * @param {ReleasesList} releasesList
 */
function setupReleasesList(releasesList, items, btnNavDownload) {
  const btnDownload = createElementFromHTML(`
<button id="submitBandcampReleases" type="button" class="btn btn-primary btn-sm" data-status-update title="Download selected releases as Discogs Draft CSV file">
  <b2d-icon name="download"></b2d-icon>
  Save to CSV
</button>
`);

  btnDownload.addEventListener('click', async () => {
    const checkedUrls = releasesList.getSelectedValues();

    findMissingKeysInStorage(checkedUrls, missingKeys => {
      openTabs(missingKeys, (tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: waitForBandcampData
        }).then(() => {});
      }).then(() => {
        setTimeout(() => {
          // Read data from the storage
          findReleasesInStorage(checkedUrls, releases => {
            setupBtnToDownloadReleasesAsCsv(btnDownload, releases);
            downloadReleasesCsv(releases);
          });
        }, 3000);
      });
    });
  });

  releasesList.appendButton(btnDownload);
}

function waitForBandcampData() {
  setTimeout(() => window.close(), 1000);
}
