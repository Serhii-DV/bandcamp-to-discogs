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
import { Music } from 'src/app/music';

export function showBandcampTab(): void {
  const btnBandcampTab = getBandcampTabElement();

  if (btnBandcampTab) {
    click(btnBandcampTab);
  }
}

export function showReleaseCardTab(release: Release): void {
  const tab = getReleaseCardContentElement();
  showCardTab(tab, getCards()).then(() => {
    setupReleaseCardTab(release);
  });
}

export function showReleasesTabContent(
  music: Music,
  searchValue: string | undefined
): void {
  const tab = getReleasesContentElement();
  showCardTab(tab, getCards()).then(() => {
    const storage = globalThis.storage;
    setupReleasesTab(storage, music, searchValue);
  });
}

export function getBandcampTabElement(): HTMLElement | null {
  return document.getElementById('bandcamp-tab');
}

export function getBandcampTabContentElement(): HTMLElement | null {
  return document.getElementById('bandcamp');
}

export function getCardTabElement(): HTMLElement | null {
  return document.getElementById('card-tab');
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

function showCardTab(
  tab: HTMLElement | null,
  tabs: (HTMLElement | null)[]
): Promise<void> {
  return new Promise((resolve, reject) => {
    const btnTab = getCardTabElement();
    if (!btnTab) {
      reject(new Error('Card tab element not found'));
      return;
    }
    if (!tab) {
      reject(new Error('Tab element not found'));
      return;
    }

    click(btnTab);
    setActiveTab(tab, tabs);
    resolve();
  });
}

function getCards(): Array<HTMLElement | null> {
  return [getReleaseCardContentElement(), getReleasesContentElement()];
}
