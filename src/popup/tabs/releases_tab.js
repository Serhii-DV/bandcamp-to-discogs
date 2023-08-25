import { openTabs } from "../../modules/chrome.js";
import { findReleasesInStorage } from "../../modules/storage.js";
import { fillReleasesForm } from "../helpers.js";
import { setupDownloadReleasesAsCsv } from "./download_tab.js";

export function setupReleasesTab(releaseList, releaseForm, btnSubmitReleases, btnDownload) {
  fillReleasesForm(releaseList, releaseForm, true);

  btnSubmitReleases.addEventListener("click", async () => {
    const checkedCheckboxes = Array.from(releaseForm.querySelectorAll('input[type="checkbox"]:checked'));
    const checkedUrls = checkedCheckboxes.map((checkbox) => checkbox.value);

    await openTabs(checkedUrls, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: waitForBandcampData
      }).then(() => {});
    }).then(() => {
      setTimeout(() => {
        setupDownloadButton(checkedUrls, btnDownload);
      }, 1000);
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
  });
}
