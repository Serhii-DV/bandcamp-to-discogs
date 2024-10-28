import { click, getDataAttribute, onClick } from '../../utils/html';
import { log } from '../../utils/console';
import {
  bandcampReleasesAndArtistsHistorySearch,
  historyItemsToArtistOrReleaseItems
} from '../../bandcamp/modules/history';
import { Release } from '../../app/release';

export function setupBandcampTab(btnHistoryTab) {
  log('Setup bandcamp tab');

  setupLatestVisitedWidget(btnHistoryTab);
}

function setupLatestVisitedWidget(btnHistoryTab) {
  const storage = globalThis.storage;
  const visitedReleasesWidget = document.getElementById('visitedReleases');
  const limit = getDataAttribute(visitedReleasesWidget, 'limit', 50);

  bandcampReleasesAndArtistsHistorySearch((results) => {
    const items = historyItemsToArtistOrReleaseItems(results);
    const uuids = items.map((item) => item.uuid);

    storage.getUuidMap(uuids).then((uuidMap) => {
      items.forEach((item) => {
        const uuidItem = uuidMap[item.uuid];

        if (uuidItem instanceof Release) {
          uuidItem.releaseItem = item;
        }

        visitedReleasesWidget.add(uuidItem ?? item);
      });

      visitedReleasesWidget.addItem(
        'link',
        '#history',
        'Go to history...',
        'Go to history...',
        false,
        (event) => {
          click(btnHistoryTab);
          event.preventDefault();
        }
      );
    });
  }, limit);

  const tabs = document.querySelectorAll('#latestViewed .nav-link');

  if (tabs) {
    onClick(tabs, (event) => {
      const tab = event.target;
      const type = getDataAttribute(tab, 'type', 'all');

      visitedReleasesWidget.show(type);

      tabs.forEach((tab) => {
        tab.classList.remove('active');
      });
      tab.classList.add('active');

      event.preventDefault();
    });
  }
}
