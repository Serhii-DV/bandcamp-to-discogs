import { click, getDataAttribute } from '../../utils/html';
import { log } from '../../utils/console';
import {
  bandcampReleasesAndArtistsHistorySearch,
  filterBandcampAlbumUrl,
  historyItemsToArtistOrReleaseItems
} from '../../bandcamp/modules/history';
import { getReleaseMapByUuids } from '../../utils/storage';
import { Release } from '../../app/release';

export function setupBandcampTab(btnHistoryTab) {
  log('Setup bandcamp tab');

  setupLatestVisitedWidget(btnHistoryTab);
}

function setupLatestVisitedWidget(btnHistoryTab) {
  const visitedReleasesWidget = document.getElementById('visitedReleases');
  const limit = getDataAttribute(visitedReleasesWidget, 'limit', 50);

  bandcampReleasesAndArtistsHistorySearch((results) => {
    // Only releases (albums)
    const bandcampItems = historyItemsToArtistOrReleaseItems(
      filterBandcampAlbumUrl(results)
    );
    const uuids = bandcampItems.map((item) => item.uuid);

    getReleaseMapByUuids(uuids).then((releasesMap) => {
      const releases = bandcampItems
        .map((item) => {
          const release = releasesMap[item.uuid];
          if (!(release instanceof Release)) return null;
          release.releaseItem = item;
          return release;
        })
        .filter(Boolean);

      visitedReleasesWidget
        .addReleases(releases)
        .addItem(
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
}
