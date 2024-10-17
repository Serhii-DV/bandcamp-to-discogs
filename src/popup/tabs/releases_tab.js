import { isEmptyArray } from '../../utils/utils';
import { getCurrentTab, openTabsAndClose } from '../../utils/chrome';
import { createElementFromHTML, input, toggleElements } from '../../utils/html';
import { getReleasesByUuids } from '../../utils/storage';
import {
  populateReleasesList,
  removeButtonLoadingState,
  setBackgroundImage,
  setButtonInLoadingState
} from '../helpers.js';
import { downloadReleasesCsv } from './download_tab.js';
import { log } from '../../utils/console';
import { getReleasesContentElement } from '../modules/main';

export function setupReleasesTab(releaseItems, bgImageSrc, searchValue) {
  log('Setup releases card tab', releaseItems, bgImageSrc, searchValue);

  setBackgroundImage(document.querySelector('.bg-image'), bgImageSrc);

  const contentElement = getReleasesContentElement();
  const releasesList = contentElement.querySelector('#releasesTabLIst');
  const isEmptyReleaseItems = isEmptyArray(releaseItems);

  toggleElements(isEmptyReleaseItems, getWarningElement(contentElement));
  toggleElements(!isEmptyReleaseItems, releasesList);

  if (isEmptyReleaseItems) {
    return;
  }

  const downloadCsvFile = async (event) => {
    const button = event.target;
    setButtonInLoadingState(button);

    const selectedUuids = releasesList.getSelectedValues();
    const bcLinks = releasesList.querySelectorAll(
      '.release-item.table-active .link-bandcamp-url'
    );
    const checkedUrls = Array.from(bcLinks).map((link) =>
      link.getAttribute('href')
    );

    // Open selected releases (add to the storage)
    openTabsAndClose(checkedUrls).then(() => {
      setTimeout(() => {
        // Read data from the storage
        getReleasesByUuids(selectedUuids).then((releases) => {
          downloadReleasesCsv(releases);
          removeButtonLoadingState(button);
        });
      }, 3000);
    });
  };

  const btnNavDownload = createElementFromHTML(`
<button class="btn btn-primary rounded-0" type="button" title="Download selected releases as Discogs CSV file" disabled>
    <b2d-icon name="download"></b2d-icon>
</button>`);
  btnNavDownload.addEventListener('click', downloadCsvFile);

  releasesList
    .appendButton(btnNavDownload)
    .addStateButton(btnNavDownload)
    .addStatusElement(
      document.getElementById('selectedStatusInfo'),
      document.getElementById('viewedStatusInfo')
    );

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

function getWarningElement(tab) {
  return tab.querySelector('.b2d-warning');
}
