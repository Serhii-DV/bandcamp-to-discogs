import { HistoryItem } from 'src/utils/history';
import { isBandcampAlbumUrl, isBandcampArtistUrl } from './url';

export function filterBandcampUrls(results: HistoryItem[]): HistoryItem[] {
  return results.filter(
    (item) =>
      item.url &&
      (isBandcampArtistUrl(item.url) || isBandcampAlbumUrl(item.url))
  );
}
