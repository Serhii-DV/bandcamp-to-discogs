import { loadKeywordMapping } from '../../bandcamp/modules/mapping';
import config from '../../config';
import { loadDiscogsGenres } from '../../discogs/modules/genres';

export async function mapMusicStyles(): Promise<void | {}> {
  await loadDiscogsGenres(config.genres_url);
  return await loadKeywordMapping(config.keyword_mapping_url);
}
