import { Release } from '../../app/release';
import { click } from '../../utils/html';
import { ReleasesList } from '../components/releases-list';
import { setupReleaseCardTab } from '../tabs/release-card_tab';
import { setupReleasesTab } from '../tabs/releases_tab';

export function showReleaseCardTab(release: Release) {
  const btnReleaseCardTab = getReleaseCardTabElement();

  if (!btnReleaseCardTab) {
    return;
  }

  click(btnReleaseCardTab);
  setupReleaseCardTab(release);
}

export function setupReleasesTabElement(): void {
  const btnReleasesTab = getReleasesTabElement();
  if (!btnReleasesTab) return;

  btnReleasesTab.addEventListener('click', () => {
    const releasesContentElement = getReleasesContentElement();
    if (!releasesContentElement) return;

    const releasesList = releasesContentElement.querySelector('releases-list');
    if (!releasesList) return;

    (releasesList as ReleasesList).refreshStatus();
  });
}

export function showReleasesTabContent(
  releasesData: [],
  bgImageSrc: string | undefined,
  searchValue: string | undefined
): void {
  const btnReleasesTab = getReleasesTabElement();
  if (!btnReleasesTab) return;

  click(btnReleasesTab);
  setupReleasesTab(releasesData, bgImageSrc, searchValue);
}

export function getReleaseCardTabElement(): HTMLElement | null {
  return document.getElementById('release-card-tab');
}

export function getReleaseCardContentElement(): HTMLElement | null {
  return document.getElementById('release-card');
}

export function getReleasesTabElement(): HTMLElement | null {
  return document.getElementById('releases-tab');
}

export function getReleasesContentElement(): HTMLElement | null {
  return document.getElementById('releases');
}
