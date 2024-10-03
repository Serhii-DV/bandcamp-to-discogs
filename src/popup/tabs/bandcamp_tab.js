import { click, getDataAttribute } from '../../utils/html';
import { log } from '../../utils/console';
import {
  getLatestHistoryData,
  getReleaseMapByUuids
} from '../../utils/storage';
import { getOwnProperty } from '../../utils/utils';

export function setupBandcampTab(btnHistoryTab) {
  log('Setup bandcamp tab');

  setupLatestVisitedWidget(btnHistoryTab);
}

function setupLatestVisitedWidget(btnHistoryTab) {
  const visitedReleasesWidget = document.getElementById('visitedReleases');
  const limit = getDataAttribute(visitedReleasesWidget, 'limit', 10);

  getLatestHistoryData(limit).then((visitedDates) => {
    const uuids = visitedDates.map((visitedDate) => visitedDate.uuid);
    getReleaseMapByUuids(uuids).then((releaseMap) => {
      visitedDates.forEach((visitedDate) => {
        const release = getOwnProperty(releaseMap, visitedDate.uuid);
        if (release) {
          visitedReleasesWidget.addRelease(release, visitedDate);
        }
      });

      visitedReleasesWidget.addItem(
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
  });
}
