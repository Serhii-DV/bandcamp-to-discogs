import { click, getDataAttribute } from '../../utils/html';
import { log } from '../../utils/console';
import { getLatestHistoryData, getReleasesByUuids } from '../../utils/storage';
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
    getReleasesByUuids(uuids).then((releaseMap) => {
      visitedDates.forEach((visitedDate) => {
        const release = getOwnProperty(releaseMap, visitedDate.uuid);
        if (release) {
          visitedReleasesWidget.addRelease(release, visitedDate);
        }
      });

      const item = visitedReleasesWidget.addItem(
        '#history',
        'Go to history...',
        'Go to history...',
        false
      );
      item.addEventListener('click', (event) => {
        click(btnHistoryTab);
        event.preventDefault();
      });
    });
  });
}
