import { Storage, StorageKey } from '../../app/core/storage';
import { Release } from '../../app/release';
import {
  click,
  getDataAttribute,
  hasDataAttribute,
  onClick,
  setActiveTab,
  setDataAttribute
} from '../../utils/html';
import { setupReleaseCardTab } from '../tabs/release-card_tab';
import { setupReleasesTab } from '../tabs/releases_tab';
import { Music } from 'src/app/music';

export function showLatestViewed(): void {
  const tab = getLatestViewedContentElement();
  showBandcampTab(tab);
}

export function showReleaseCard(release: Release): void {
  const tab = getReleaseCardContentElement();
  showBandcampTab(tab).then(() => {
    setupReleaseCardTab(release);
  });
}

export function showReleases(
  music: Music,
  searchValue: string | undefined
): void {
  const tab = getReleasesContentElement();
  showBandcampTab(tab).then(() => {
    const storage = globalThis.storage;
    setupReleasesTab(storage, music, searchValue);
  });
}

export function getBandcampTabButton(): HTMLElement | null {
  return document.getElementById('bandcamp-tab');
}

export function getBandcampTabContentElement(): HTMLElement | null {
  return document.getElementById('bandcamp');
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

export function setupLatestViewedButton(btn: HTMLElement | null): void {
  onClick(btn, () => {
    showLatestViewed();
  });
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

function showBandcampTab(tab: HTMLElement | null): Promise<void> {
  return showCardTab(tab, getContentCards(), getBandcampTabButton());
}

function showCardTab(
  tab: HTMLElement | null,
  tabs: (HTMLElement | null)[],
  btnTab: HTMLElement | null
): Promise<void> {
  return new Promise((resolve, reject) => {
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

function getContentCards(): Array<HTMLElement | null> {
  return [
    getLatestViewedContentElement(),
    getReleaseCardContentElement(),
    getReleasesContentElement()
  ];
}
