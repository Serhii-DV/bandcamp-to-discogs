import { ReleaseItem } from '../app/releaseItem';
import { ArtistItem } from '../app/artistItem';
import { History, uuid } from './storage';
import { log } from './console';

type GetUrlHistoryCallback = (history: History) => void;
type GetLatestVisitDateCallback = (latestVisit: Date | null) => void;
export type HistoryItem = chrome.history.HistoryItem;
export type GetLatestVisitsCallback = (results: HistoryItem[]) => void;
export interface VisitDateMap {
  [key: uuid]: Date;
}

export function getUrlHistory(
  url: string,
  callable: GetUrlHistoryCallback
): void {
  chrome.history.getVisits({ url }, (visits) => {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving history:', chrome.runtime.lastError);
      return;
    }

    const history: History = visits
      .filter((visit) => visit.visitTime !== undefined)
      .map((visit) => new Date(visit.visitTime!));

    callable(history);
  });
}

export function getLatestVisitDateByUrl(
  url: string,
  callable: GetLatestVisitDateCallback
): void {
  chrome.history.search(
    { text: url, maxResults: 1, startTime: 0 },
    (results) => {
      let latestVisitDate = null;
      if (chrome.runtime.lastError) {
        console.error(
          `Error retrieving history for ${url}:`,
          chrome.runtime.lastError
        );
      } else if (results.length > 0) {
        const latestVisitTime = results[0].lastVisitTime;
        latestVisitDate = latestVisitTime ? new Date(latestVisitTime) : null;
      }

      callable(latestVisitDate);
    }
  );
}

export function historySearch(
  searchText: string,
  callable: GetLatestVisitsCallback,
  maxResults: number = 200,
  startTime: number = 0
): void {
  const query = { text: searchText, maxResults, startTime };
  chrome.history.search(query, (results) => {
    if (chrome.runtime.lastError) {
      console.error(
        `Error retrieving history for ${searchText}:`,
        chrome.runtime.lastError
      );
      results = [];
    }

    log('History search', query, results);
    callable(results);
  });
}

export function historyItemToReleaseItem(
  historyItem: HistoryItem
): ReleaseItem | null {
  if (!historyItem.url || !historyItem.title) return null;

  const releaseDetails = extractReleaseDetailsFromPageTitle(historyItem.title);
  const itemId = 0;
  const visit = historyItem.lastVisitTime
    ? new Date(historyItem.lastVisitTime)
    : undefined;

  return new ReleaseItem(
    historyItem.url,
    releaseDetails.artist,
    releaseDetails.title,
    itemId,
    releaseDetails.label,
    visit
  );
}

export function historyItemToArtistItem(
  historyItem: HistoryItem
): ArtistItem | null {
  if (!historyItem.url || !historyItem.title) return null;

  const artist = extractArtistFromPageTitle(historyItem.title);
  const visit = historyItem.lastVisitTime
    ? new Date(historyItem.lastVisitTime)
    : undefined;

  return new ArtistItem(historyItem.url, artist, undefined, visit);
}

interface ReleaseDetails {
  title: string;
  artist: string;
  label?: string;
}

function extractReleaseDetailsFromPageTitle(pageTitle: string): ReleaseDetails {
  const parts = pageTitle.split('|').map((part) => part.trim());

  const title = parts[0];
  const artist = parts[1];
  const label = parts.length > 2 ? parts[2] : undefined;

  return {
    title,
    artist,
    label
  };
}

function extractArtistFromPageTitle(pageTitle: string): string {
  const parts = pageTitle.split('|').map((part) => part.trim());

  return parts[parts.length - 1] || '';
}
