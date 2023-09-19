import { openTabs } from "../../modules/chrome.js";
import { findMissingKeysInStorage, findReleasesInStorage } from "../../modules/storage.js";
import { setBackgroundImage, transformReleasesToReleasesListData } from "../helpers.js";
import { downloadReleasesCsv } from "./download_tab.js";

export function setupReleasesTab(releaseList, bgImageSrc, btnNavDownload) {
  setBackgroundImage(document.querySelector('.bg-image'), bgImageSrc);
  const releasesList = document.querySelector('#releasesTabLIst');
  releasesList.populateData(
    transformReleasesToReleasesListData(releaseList)
  );

  const saveToCsv = async () => {
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
            downloadReleasesCsv(releases);
          });
        }, 3000);
      });
    });
  };

  btnNavDownload.addEventListener('click', saveToCsv);
  releasesList.addStateButton(btnNavDownload);
}

function waitForBandcampData() {
  setTimeout(() => window.close(), 1000);
}
