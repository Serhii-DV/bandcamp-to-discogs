import { uuid } from '../../utils/storage';
import {
  HistoryItem,
  historyItemToArtistItem,
  historyItemToReleaseItem
} from '../../utils/history';
import {
  isBandcampAlbumUrl,
  isBandcampArtistUrl,
  isBandcampSiteUrl
} from './url';
import { ArtistOrReleaseItem } from 'src/popup/modules/releasesList';
import { log } from '../../utils/console';

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

export function historyItemsToArtistOrReleaseItems(
  historyItems: HistoryItem[]
): ArtistOrReleaseItem[] {
  const items: ArtistOrReleaseItem[] = [];
  const bandcampHistoryItems = filterBandcampUrls(historyItems);
  const uuids: uuid[] = [];

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
