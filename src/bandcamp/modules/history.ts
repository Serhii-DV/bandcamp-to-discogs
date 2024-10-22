import {
  HistoryItem,
  historyItemToArtistItem,
  historyItemToReleaseItem
} from '../../utils/history';
import { isBandcampAlbumUrl, isBandcampArtistUrl } from './url';
import { ArtistOrReleaseItem } from 'src/popup/modules/releasesList';

export function filterBandcampUrls(historyItems: HistoryItem[]): HistoryItem[] {
  return historyItems.filter(
    (item) =>
      item.url &&
      (isBandcampArtistUrl(item.url) || isBandcampAlbumUrl(item.url))
  );
}

export function historyItemsToArtistOrReleaseItems(
  historyItems: HistoryItem[]
): ArtistOrReleaseItem[] {
  const items: ArtistOrReleaseItem[] = [];
  const bandcampHistoryItems = filterBandcampUrls(historyItems);

  bandcampHistoryItems.forEach((historyItem) => {
    if (!historyItem.url) return;

    let item = undefined;

    if (isBandcampAlbumUrl(historyItem.url)) {
      item = historyItemToReleaseItem(historyItem);
    } else if (isBandcampArtistUrl(historyItem.url)) {
      item = historyItemToArtistItem(historyItem);
    }

    if (item) {
      items.push(item);
    }
  });

  return items;
}
