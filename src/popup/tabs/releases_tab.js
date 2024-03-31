import { ReleaseItem } from "../../app/release.js";
import { getCurrentTab, openTabs } from "../../modules/chrome.js";
import { input } from "../../modules/html.js";
import { findMissingUrls, findReleasesByUrls } from "../../modules/storage.js";
import { populateReleasesList, removeButtonLoadingState, setBackgroundImage, setButtonInLoadingState } from "../helpers.js";
import { downloadReleasesCsv } from "./download_tab.js";

export function setupReleasesTab(tab, releasesData, bgImageSrc, searchValue, btnNavDownload) {
  setBackgroundImage(document.querySelector('.bg-image'), bgImageSrc);
  const releasesList = tab.querySelector('#releasesTabLIst');
  const downloadCsvFile = async (event) => {
    const button = event.target;
    setButtonInLoadingState(button);

    const checkedUrls = releasesList.getSelectedValues();
    findMissingUrls(checkedUrls, missingUrls => {
      openTabs(missingUrls, (tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: waitForBandcampData
        }).then(() => {});
      }).then(() => {
        setTimeout(() => {
          // Read data from the storage
          findReleasesByUrls(checkedUrls, releases => {
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

  const releaseItems = [];
  releasesData.forEach(obj => releaseItems.push(ReleaseItem.fromStorageObject(obj)));
  populateReleasesList(releasesList, releaseItems);

  let activeTab;
  releasesList.searchInput.addEventListener('input', () => {
    const selectedValue = releasesList.searchInput.value;

    if (!activeTab) {
      getCurrentTab().then((tab) => {
        activeTab = tab;
        sendSearchMessageToTab(activeTab, selectedValue);
      });
    } else {
      sendSearchMessageToTab(activeTab, selectedValue);
    }
  });

  input(releasesList.searchInput, searchValue);

  function sendSearchMessageToTab(tab, search) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'releases-list-search',
      search: search
    });
  }
}

function waitForBandcampData() {
  setTimeout(() => window.close(), 1000);
}
