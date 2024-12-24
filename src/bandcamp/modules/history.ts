import {
  historyItemToArtistItem,
  historyItemToReleaseItem,
  historySearch
} from '../../utils/history';
import { ArtistOrReleaseItem } from 'src/popup/modules/releasesList';
import { log } from '../../utils/console';
import { GetLatestVisitsCallback, HistoryItem, Uuid } from '../../types';
import { BandcampURL } from '../../app/core/bandcampUrl';

export function bandcampReleasesAndArtistsHistorySearch(
  callable: GetLatestVisitsCallback,
  maxResults: number = 200
): void {
  historySearch('bandcamp.com', callable, maxResults);
}

function filterBandcampUrls(historyItems: HistoryItem[]): HistoryItem[] {
  return historyItems.filter((item) => {
    try {
      const bandcampUrl = new BandcampURL(item.url ?? '');
      return bandcampUrl.isMusic || bandcampUrl.isAlbum;
    } catch (error) {
      return false;
    }
  });
}

export function historyItemsToArtistOrReleaseItems(
  historyItems: HistoryItem[]
): ArtistOrReleaseItem[] {
  const items: ArtistOrReleaseItem[] = [];
  const bandcampHistoryItems = filterBandcampUrls(historyItems);
  const uuids: Uuid[] = [];

  bandcampHistoryItems.forEach((historyItem) => {
    try {
      const bandcampUrl = new BandcampURL(historyItem.url ?? '');
      if (bandcampUrl.isRegular) return;

      let item = undefined;

      if (bandcampUrl.isAlbum) {
        item = historyItemToReleaseItem(historyItem);
      } else if (bandcampUrl.isMusic) {
        item = historyItemToArtistItem(historyItem);
      }

      if (item && !uuids.includes(item.uuid)) {
        items.push(item);
        uuids.push(item.uuid);
      }
    } catch (error) {}
  });

  log('historyItemsToArtistOrReleaseItems', items);

  return items;
}
