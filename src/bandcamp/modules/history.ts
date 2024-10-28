import {
  historyItemToArtistItem,
  historyItemToReleaseItem,
  historySearch
} from '../../utils/history';
import {
  isBandcampAlbumUrl,
  isBandcampArtistUrl,
  isBandcampSiteUrl
} from './url';
import { ArtistOrReleaseItem } from 'src/popup/modules/releasesList';
import { log } from '../../utils/console';
import { GetLatestVisitsCallback, HistoryItem, Uuid } from '../../types';

export function bandcampReleasesAndArtistsHistorySearch(
  callable: GetLatestVisitsCallback,
  maxResults: number = 200
): void {
  historySearch('bandcamp.com', callable, maxResults);
}

export function filterBandcampUrls(historyItems: HistoryItem[]): HistoryItem[] {
  return historyItems.filter(
    (item) =>
      item.url &&
      (isBandcampArtistUrl(item.url) || isBandcampAlbumUrl(item.url))
  );
}

export function filterBandcampAlbumUrl(
  historyItems: HistoryItem[]
): HistoryItem[] {
  return historyItems.filter(
    (item) => item.url && isBandcampAlbumUrl(item.url)
  );
}

export function filterBandcampArtistUrl(
  historyItems: HistoryItem[]
): HistoryItem[] {
  return historyItems.filter(
    (item) => item.url && isBandcampArtistUrl(item.url)
  );
}

export function historyItemsToArtistOrReleaseItems(
  historyItems: HistoryItem[]
): ArtistOrReleaseItem[] {
  const items: ArtistOrReleaseItem[] = [];
  const bandcampHistoryItems = filterBandcampUrls(historyItems);
  const uuids: Uuid[] = [];

  bandcampHistoryItems.forEach((historyItem) => {
    if (!historyItem.url || isBandcampSiteUrl(historyItem.url)) return;

    let item = undefined;

    if (isBandcampAlbumUrl(historyItem.url)) {
      item = historyItemToReleaseItem(historyItem);
    } else if (isBandcampArtistUrl(historyItem.url)) {
      item = historyItemToArtistItem(historyItem);
    }

    if (item && !uuids.includes(item.uuid)) {
      items.push(item);
      uuids.push(item.uuid);
    }
  });

  log('historyItemsToArtistOrReleaseItems', items);

  return items;
}
