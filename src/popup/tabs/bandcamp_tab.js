import { click, getDataAttribute } from '../../utils/html';
import { log } from '../../utils/console';
import {
  bandcampReleasesAndArtistsHistorySearch,
  filterBandcampAlbumUrl,
  filterBandcampArtistUrl,
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
  const visitedArtistsWidget = document.getElementById('visitedArtists');
  const limit = getDataAttribute(visitedReleasesWidget, 'limit', 50);

  bandcampReleasesAndArtistsHistorySearch((results) => {
    const releaseItems = historyItemsToArtistOrReleaseItems(
      filterBandcampAlbumUrl(results)
    );
    const artistItems = historyItemsToArtistOrReleaseItems(
      filterBandcampArtistUrl(results)
    );
    const uuids = releaseItems.map((item) => item.uuid);

    getReleaseMapByUuids(uuids).then((releasesMap) => {
      const releases = releaseItems
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

    visitedArtistsWidget.addBandcampItems(artistItems);
  }, limit);
}
