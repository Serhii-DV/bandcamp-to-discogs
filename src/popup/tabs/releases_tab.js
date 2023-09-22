import { openTabs } from "../../modules/chrome.js";
import { findMissingKeysInStorage, findReleasesInStorage } from "../../modules/storage.js";
import { removeButtonLoadingState, setBackgroundImage, setButtonInLoadingState, transformReleasesToReleasesListData } from "../helpers.js";
import { downloadReleasesCsv } from "./download_tab.js";

export function setupReleasesTab(tab, releaseList, bgImageSrc, btnNavDownload) {
  setBackgroundImage(document.querySelector('.bg-image'), bgImageSrc);
  const releasesList = tab.querySelector('#releasesTabLIst');
  const downloadCsvFile = async (event) => {
    const button = event.target;
    setButtonInLoadingState(button);

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
            removeButtonLoadingState(button);
          });
        }, 3000);
      });
    });
  };

  btnNavDownload.addEventListener('click', downloadCsvFile);
  releasesList
    .addStateButton(btnNavDownload)
    .addStatusElement(
      document.getElementById('selectedStatusInfo'),
      document.getElementById('viewedStatusInfo')
    );

  releasesList.populateData(
    transformReleasesToReleasesListData(releaseList)
  );
}

function waitForBandcampData() {
  setTimeout(() => window.close(), 1000);
}
