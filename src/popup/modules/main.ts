import { log } from '../../utils/console';
import { Storage, StorageKey } from '../../app/core/storage';
import { Release } from '../../app/release';
import {
  click,
  getDataAttribute,
  hasDataAttribute,
  setActiveTab,
  setDataAttribute
} from '../../utils/html';
import { setupReleaseCardTab } from '../tabs/release-card_tab';
import { setupReleasesTab } from '../tabs/releases_tab';
import { Music } from '../../app/music';
import { hasClass } from '../../utils/utils';

export function showLatestViewed(): void {
  const btn = getBandcampTabButton();
  if (btn) {
    click(btn);
  }
}

export function showReleaseCard(release: Release): void {
  setupReleaseCardTab(release);

  const tab = getReleaseCardContentElement();
  showCardTab(tab);
}

export function showReleases(
  music: Music,
  searchValue: string | undefined
): void {
  const storage = globalThis.storage;
  setupReleasesTab(storage, music, searchValue);

  const tab = getReleasesContentElement();
  showCardTab(tab);
}

export function getBandcampTabButton(): HTMLElement | null {
  return document.getElementById('bandcamp-tab');
}

export function getBandcampTabContentElement(): HTMLElement | null {
  return document.getElementById('bandcamp');
}

export function getCardTabButton(): HTMLElement | null {
  return document.getElementById('card-tab');
}

export function getLatestViewedContentElement(): HTMLElement | null {
  return document.getElementById('latest-viewed');
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

export function getHistoryTabElement(): HTMLElement | null {
  return document.getElementById('history-tab');
}

export function getHistoryContentElement(): HTMLElement | null {
  return document.getElementById('history');
}

export function setupNavigationLinks(storage: Storage): void {
  const wishlistLink = document.getElementById('wishlist-link');
  const feedLink = document.getElementById('feed-link');

  if (!wishlistLink || !feedLink) return;

  backupTitleAttribute(wishlistLink);
  backupTitleAttribute(feedLink);

  const dataKey = StorageKey.BANDCAMP_DATA;

  storage.get([dataKey]).then((item) => {
    if (!item[dataKey]) return;
    const user = item[dataKey].user;
    const usernameInTitle = ` [${user.username}]`;

    feedLink.setAttribute('href', user.url + '/feed');
    feedLink.setAttribute(
      'title',
      getOriginalTitle(feedLink) + usernameInTitle
    );
    wishlistLink.setAttribute('href', user.url + '/wishlist');
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

function showCardTab(tab: HTMLElement | null): void {
  log(`Show card tab "${tab?.id}"`);

  const btn = getCardTabButton();
  if (btn && !hasClass(btn, 'active')) {
    click(btn);
  }

  setActiveTab(tab, getCardContentCards());
}

function getCardContentCards(): Array<HTMLElement | null> {
  return [getReleaseCardContentElement(), getReleasesContentElement()];
}
