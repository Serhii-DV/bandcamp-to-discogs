import { createElementFromHTML } from '../../utils/html';
import { log } from '../../utils/console';
import { getLatestHistoryData, getReleasesByUuids } from '../../utils/storage';
import { getOwnProperty } from '../../utils/utils';

export function setupDashboardTab() {
  log('Setup dashboard tab');

  getLatestHistoryData(5).then((historyData) => {
    const uuids = Object.keys(historyData);
    getReleasesByUuids(uuids).then((releases) => {
      populateLatestVisitedReleases(releases, historyData);
    });
  });
}

/**
 * @param {Array<Release>} releases
 * @param {Record<string, string>} historyData
 */
function populateLatestVisitedReleases(releases, historyData) {
  const latestVisitedReleases = document.getElementById(
    'latestVisitedReleases'
  );

  releases.forEach((release) => {
    const lastHistoryDate = getOwnProperty(historyData, release.uuid, 0);
    const visitedDate = new Date(lastHistoryDate);
    const listItemEl = createElementFromHTML(`
  <a href="${release.url}" class="list-group-item list-group-item-action" target="_blank">
    <div class="d-flex justify-content-between">
      <div class="flex-shrink-0">
        <img src="${release.image}" alt="${release.year} - ${release.title}" class="img-fluid" style="width: 50px; height: 50px;">
      </div>
      <div class="flex-grow-1 ms-3">
        <div class="d-flex w-100 justify-content-between">
          <h6 class="mb-1">${release.artist}</h6>
          <small title="Visited on ${visitedDate.toLocaleString()}" class="text-body-secondary">${visitedDate.toLocaleDateString()}</small>
        </div>
        <p class="mb-0">${release.year} - ${release.title}</p>
        <small class="text-body-secondary text-break">${release.url}</small>
      </div>
    </div>
  </a>
`);

    latestVisitedReleases.appendChild(listItemEl);
  });
}
