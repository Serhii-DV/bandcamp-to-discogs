import { STORAGE_KEY } from '../../app/core/storage';
import { Release } from '../../app/release';
import {
  click,
  getDataAttribute,
  hasDataAttribute,
  setDataAttribute
} from '../../utils/html';
import { ReleasesList } from '../components/releases-list';
import { setupReleaseCardTab } from '../tabs/release-card_tab';
import { setupReleasesTab } from '../tabs/releases_tab';
import { Music } from 'src/app/music';

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
  music: Music,
  searchValue: string | undefined
): void {
  const btnReleasesTab = getReleasesTabElement();
  if (!btnReleasesTab) return;

  click(btnReleasesTab);
  setupReleasesTab(music, searchValue);
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

export function setupNavigationLinks(): void {
  const storage = globalThis.storage;

  const wishlistLink = document.getElementById('wishlist-link');
  const feedLink = document.getElementById('feed-link');

  if (!wishlistLink || !feedLink) return;

  backupTitleAttribute(wishlistLink);
  backupTitleAttribute(feedLink);

  const dataKey = STORAGE_KEY.BANDCAMP_DATA;

  storage.get([dataKey]).then((item) => {
    if (!item[dataKey]) return;
    const user = item[dataKey].user;
    const usernameInTitle = ` [${user.username}]`;

    feedLink.setAttribute('href', user.url + '/feed');
    feedLink.setAttribute(
      'title',
      getOriginalTitle(feedLink) + usernameInTitle
    );
    wishlistLink.setAttribute('href', user.url);
    wishlistLink.setAttribute(
      'title',
      getOriginalTitle(wishlistLink) + usernameInTitle
    );
  });
}

function backupTitleAttribute(element: HTMLElement): HTMLElement {
  if (hasDataAttribute(element, 'org-title')) return element;

  const title = element.getAttribute('title');
  if (title) {
    setDataAttribute(element, 'org-title', title);
  }
  return element;
}

function getOriginalTitle(element: HTMLElement): string {
  return getDataAttribute(element, 'org-title');
}
