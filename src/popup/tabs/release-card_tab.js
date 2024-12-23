import { log } from '../../utils/console';
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

  if (isRelease) {
    getUrlHistory(release.url.toString(), (history) => {
      renderReleaseCard(
        release,
        history,
        document.getElementById('releaseCardTemplate'),
        contentElement.querySelector('main')
      );
      setupConsoleLogRelease(release);
    });
  }
}
