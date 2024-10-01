import {
  click,
  createElementFromHTML,
  getDataAttribute
} from '../../utils/html';
import { log } from '../../utils/console';
import { getLatestHistoryData, getReleasesByUuids } from '../../utils/storage';
import { getOwnProperty } from '../../utils/utils';

export function setupDashboardTab(btnHistoryTab) {
  log('Setup dashboard tab');

  setupLatestVisitedWidget(btnHistoryTab);
}

function setupLatestVisitedWidget(btnHistoryTab) {
  const latestVisitedWidget = document.getElementById('latestVisitedReleases');

  // Init list group
  latestVisitedWidget.classList.add('list-group');
  const limit = getDataAttribute(latestVisitedWidget, 'limit', 10);

  getLatestHistoryData(limit).then((visitedDates) => {
    const uuids = visitedDates.map((visitedDate) => visitedDate.uuid);
    getReleasesByUuids(uuids).then((releases) => {
      populateLatestVisitedReleases(
        latestVisitedWidget,
        releases,
        visitedDates
      );
      addGoToHistoryItem(latestVisitedWidget, btnHistoryTab);
    });
  });
}

/**
 * @param {ReleaseMap} releaseMap
 * @param {Array<VisitedDate>} visitedDates
 */
function populateLatestVisitedReleases(
  latestVisitedReleases,
  releaseMap,
  visitedDates
) {
  visitedDates.forEach((visitedDate) => {
    const uuid = visitedDate.uuid;
    const release = getOwnProperty(releaseMap, uuid);
    if (release) {
      const listItemEl = createListItemElement(release, visitedDate);
      latestVisitedReleases.appendChild(listItemEl);
    }
  });
}

const addGoToHistoryItem = (latestVisitedReleases, btnHistoryTab) => {
  // Add "See history" link
  const historyItemEl = createElementFromHTML(`
    <a href="#history" class="list-group-item list-group-item-action">
      Go to history...
    </a>
  `);

  historyItemEl.addEventListener('click', (event) => {
    click(btnHistoryTab);
    event.preventDefault();
  });

  latestVisitedReleases.appendChild(historyItemEl);
};

/**
 * @param {Release} release
 * @param {VisitedDate} visitedDate
 */
const createListItemElement = (release, visitedDate) => {
  return createElementFromHTML(`
    <a href="${release.url}" class="list-group-item list-group-item-action" target="_blank">
      <div class="d-flex justify-content-between">
        <div class="flex-shrink-0">
          <img src="${release.image}" alt="${release.year} - ${release.title}" class="img-fluid" style="width: 80px; height: 80px;">
        </div>
        <div class="flex-grow-1 ms-3">
          <div class="d-flex w-100 justify-content-between">
            <h6 class="release-artist mb-1">${release.artist}</h6>
            <relative-time class="release-visited-date text-body-secondary" datetime="${visitedDate.date.toISOString()}">${visitedDate.date.toLocaleString()}</relative-time>
          </div>
          <p class="release-title mb-0">${release.year} - ${release.title}</p>
          <small class="release-url text-body-secondary text-break">${release.url}</small>
        </div>
      </div>
    </a>
  `);
};
