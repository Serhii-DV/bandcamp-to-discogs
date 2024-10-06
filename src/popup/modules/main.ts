import { Release } from '../../app/release';
import { click, hide, show } from '../../utils/html';
import { setupReleaseCardTab } from '../tabs/release-card_tab';

export function showReleaseCardTab(release: Release) {
  const btnReleaseCardTab = getReleaseCardTabElement();
  const btnReleasesTab = getReleasesTabElement();

  if (!btnReleaseCardTab) {
    return;
  }

  hide(btnReleasesTab);
  show(btnReleaseCardTab);
  click(btnReleaseCardTab);

  const releaseCardElement = getReleaseCardElement();

  if (!releaseCardElement) {
    return;
  }

  setupReleaseCardTab(releaseCardElement, release);
}

function getReleaseCardTabElement(): HTMLElement | null {
  return document.getElementById('release-card-tab');
}

function getReleaseCardElement(): HTMLElement | null {
  return document.getElementById('release-card');
}

function getReleasesTabElement(): HTMLElement | null {
  return document.getElementById('releases-tab');
}
