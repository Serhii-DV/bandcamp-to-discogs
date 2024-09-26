import { log } from '../../utils/console';
import { getLatestHistoryData, getReleasesByUuids } from '../../utils/storage';
import { populateReleasesList } from '../helpers';

export function setupDashboardTab(tab) {
  log('Setup dashboard tab');
  const releasesList = getLatestVisitedReleasesList();

  getLatestHistoryData(5).then((historyData) => {
    const uuids = Object.keys(historyData);
    getReleasesByUuids(uuids).then((releases) => {
      populateReleasesList(releasesList, releases);
    });
  });
}

/**
 * @returns {ReleasesList}
 */
function getLatestVisitedReleasesList() {
  return document.getElementById('latestVisitedReleasesList');
}
