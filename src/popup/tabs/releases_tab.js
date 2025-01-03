import { isEmptyArray } from '../../utils/utils';
import {
  chromeSendMessageToTab,
  getCurrentTab,
  openTabsAndClose
} from '../../utils/chrome';
import { createElementFromHTML, input, toggleElements } from '../../utils/html';
import {
  removeButtonLoadingState,
  setBackgroundImage,
  setButtonInLoadingState
} from '../helpers.js';
import { downloadReleasesCsv } from './download_tab.js';
import { log } from '../../utils/console';
import { getReleasesContentElement } from '../modules/main';
import { Music } from '../../app/music';
import {
  createUuidMap,
  populateReleasesList,
  updateVisitProperty
} from '../modules/releasesList';
import {
  bandcampReleasesAndArtistsHistorySearch,
  historyItemsToArtistOrReleaseItems
} from '../../bandcamp/modules/history';
import { MessageType } from '../../app/core/messageType';
import { BandcampURL } from '../../app/core/bandcampUrl';

export function setupReleasesTab(storage, music, searchValue) {
  log('Setup releases card tab', music, searchValue);

  const isMusic = music instanceof Music;
  if (isMusic) {
    setBackgroundImage(document.querySelector('.bg-image'), music.artist.image);
  }

  const releaseItems = isMusic ? music.albums : [];
  const contentElement = getReleasesContentElement();
  const releasesList = contentElement.querySelector('#releasesTabLIst');
  const isEmptyReleaseItems = isEmptyArray(releaseItems);
  const musicHeadline = contentElement.querySelector('#releasesTabHeadline');

  if (isMusic) {
    musicHeadline.textContent = music.artist.name;
  }

  toggleElements(!isEmptyReleaseItems, releasesList);

  if (isEmptyReleaseItems) {
    return;
  }

  initDownloadButton(releasesList, storage);

  releasesList.addStatusElement(
    document.getElementById('selectedStatusInfo'),
    document.getElementById('viewedStatusInfo')
  );

  bandcampReleasesAndArtistsHistorySearch((results) => {
    const historyReleaseItems = historyItemsToArtistOrReleaseItems(results);
    updateVisitProperty(releaseItems, createUuidMap(historyReleaseItems));
    populateReleasesList(releasesList, releaseItems, false);
  }, 500);

  setupSearchInput(releasesList.searchInput, searchValue);
}

function setupSearchInput(searchInput, searchValue) {
  getCurrentTab().then((tab) => {
    if (!tab) return;

    try {
      const bandcampUrl = new BandcampURL(tab.url);
      if (!bandcampUrl.isMusic) return;
    } catch {
      return;
    }

    searchInput.addEventListener('input', () => {
      chromeSendMessageToTab(
        {
          type: MessageType.Search,
          search: searchInput.value
        },
        tab
      );
    });
  });

  input(searchInput, searchValue);
}

function initDownloadButton(releasesListElement, storage) {
  let btnNavDownload = releasesListElement.querySelector(
    '#releasesTabLIst__downloadBtn'
  );

  if (btnNavDownload) return;

  btnNavDownload = createElementFromHTML(`
    <button id="releasesTabLIst__downloadBtn" class="btn btn-primary rounded-0" type="button" title="Download selected releases as Discogs CSV file" disabled>
        <b2d-icon name="download"></b2d-icon>
    </button>`);

  const downloadCsvFile = async (event) => {
    const button = event.target;
    setButtonInLoadingState(button);

    const selectedUuids = releasesListElement.getSelectedValues();
    const bcLinks = releasesListElement.querySelectorAll(
      '.release-item.table-active .link-bandcamp-url'
    );
    const checkedUrls = Array.from(bcLinks).map((link) =>
      link.getAttribute('href')
    );

    // Open selected releases (add to the storage)
    openTabsAndClose(checkedUrls).then(() => {
      setTimeout(() => {
        // Read data from the storage
        storage.getByUuids(selectedUuids).then((releases) => {
          downloadReleasesCsv(releases);
          removeButtonLoadingState(button);
        });
      }, 3000);
    });
  };

  btnNavDownload.addEventListener('click', downloadCsvFile);

  releasesListElement
    .appendButton(btnNavDownload)
    .addStateButton(btnNavDownload);
}
