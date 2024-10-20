import { History } from './storage';

type GetUrlHistoryCallback = (history: History) => void;

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
