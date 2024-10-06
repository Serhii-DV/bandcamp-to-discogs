import { Release } from '../../app/release';
import { click } from '../../utils/html';
import { setupReleaseCardTab } from '../tabs/release-card_tab';

export function showReleaseCardTab(release: Release) {
  const btnReleaseCardTab = getReleaseCardTabElement();

  if (!btnReleaseCardTab) {
    return;
  }

  click(btnReleaseCardTab);

  const releaseCardElement = getReleaseCardElement();

  if (!releaseCardElement) {
    return;
  }

  setupReleaseCardTab(releaseCardElement, release);
}

export function getReleaseCardTabElement(): HTMLElement | null {
  return document.getElementById('release-card-tab');
}

export function getReleaseCardElement(): HTMLElement | null {
  return document.getElementById('release-card');
}

export function getReleasesTabElement(): HTMLElement | null {
  return document.getElementById('releases-tab');
}
