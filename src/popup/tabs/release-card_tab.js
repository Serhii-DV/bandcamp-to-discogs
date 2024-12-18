import { log } from '../../utils/console';
import { toggleElements } from '../../utils/html';
import { Release } from '../../app/release.js';
import { getReleaseCardContentElement } from '../modules/main';
import { getUrlHistory } from '../../utils/history';
import { setupConsoleLogRelease } from '../console.js';
import { renderReleaseCard } from '../modules/renderRelease';

/**
 * @param {Release} release
 */
export function setupReleaseCardTab(release) {
  log('Setup release card tab', release);

  const contentElement = getReleaseCardContentElement();
  const isRelease = release instanceof Release;

  toggleElements(!isRelease, getWarningElement(contentElement));

  if (isRelease) {
    getUrlHistory(release.url, (history) => {
      renderReleaseCard(release, history, contentElement.querySelector('main'));
      setupConsoleLogRelease(release);
    });
  }
}

function getWarningElement(tab) {
  return tab.querySelector('.b2d-warning');
}
