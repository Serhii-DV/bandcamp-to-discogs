import config from '../../config';
import {
  keywordsToDiscogsGenres,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp';
import { getExtensionManifest } from '../../utils/chrome';
import {
  generateSelfReleasedLabel,
  generateSubmissionNotesDefault,
  generateSubmissionNotesShort
} from '../modules/discogs';
import { getDiscogsDateValue } from './utils';
import { Release } from '../../app/release';
import { convertArtistName } from '../modules/submission';
import { arrayUnique, capitalizeEachWord } from '../../utils/utils';

export interface Format {
  fileType: MetadataValue;
  qty: MetadataValue;
  description: MetadataValue;
  freeText: MetadataValue;
}

interface Released {
  publishedDate: string;
  modifiedDate: string;
}

interface Genres {
  keywords: string[];
  autoDetectedGenres: string[];
  autoDetectedStyles: string[];
}

interface MetadataParams {
  artist: string;
  artists: string[];
  title: string;
  label: string;
  trackQty: number;
  formatFileType: string;
  formatDescription: string;
  freeText: string;
  country?: string;
  released: Released;
  tracklist: string;
  credits: string;
  genres: Genres;
  releaseUrl: string;
}

export type MetadataValue = string | string[];

export function metadataValueAsArray(value: MetadataValue): string[] {
  return Array.isArray(value) ? value : [value];
}

export function metadataValueAsString(value: MetadataValue): string {
  return Array.isArray(value) ? (value[0] as string) : value;
}

/**
 * Converts MetadataValue based on its content:
 * - If it's a string, returns the string.
 * - If it's an array, applies `arrayUnique` to remove duplicates.
 *   - If the resulting array has a single element, returns that element as a string.
 *   - If the resulting array has more than one element, returns the array as-is.
 */
function convertMetadataValue(value: MetadataValue): string | string[] {
  if (Array.isArray(value)) {
    const uniqueArray = arrayUnique(value);
    return uniqueArray.length === 1 ? uniqueArray[0] : uniqueArray;
  }
  return value;
}

export class Metadata {
  version: string;
  artist: MetadataValue;
  title: MetadataValue;
  label: MetadataValue;
  format: Format;
  country: MetadataValue;
  released: Released;
  tracklist: string;
  credits: string;
  genres: Genres;
  submissionNotes: MetadataValue;

  constructor(params: MetadataParams) {
    const manifest = getExtensionManifest();

    this.version = manifest.version;
    this.artist = convertMetadataValue([
      // Do not add default artist if there is more than one artist
      ...(params.artists.length > 1
        ? []
        : [
            params.artist,
            capitalizeEachWord(params.artist),
            convertArtistName(params.artist)
          ]),
      ...params.artists.map((artist) => capitalizeEachWord(artist)),
      ...params.artists.map((artist) => convertArtistName(artist)),
      ...params.artists
    ]);
    this.title = convertMetadataValue([
      params.title,
      capitalizeEachWord(params.title)
    ]);
    this.label = convertMetadataValue([
      params.artist === params.label
        ? generateSelfReleasedLabel(params.artist)
        : params.label,
      params.label
    ]);
    this.format = {
      fileType: convertMetadataValue([
        params.formatFileType,
        'FLAC',
        'WAV',
        'MP3'
      ]),
      qty: convertMetadataValue(params.trackQty.toString()),
      description: convertMetadataValue(params.formatDescription),
      freeText: convertMetadataValue([params.freeText, '320 kbps', '128 kbps'])
    };
    this.country = convertMetadataValue([
      params.country ?? config.metadata.country,
      config.metadata.country
    ]);
    this.released = params.released;
    this.tracklist = params.tracklist;
    this.credits = params.credits;
    this.genres = params.genres;
    this.submissionNotes = convertMetadataValue([
      generateSubmissionNotesDefault(params.releaseUrl),
      generateSubmissionNotesShort(params.releaseUrl)
    ]);
  }

  static fromRelease(release: Release): Metadata {
    const publishedDate = getDiscogsDateValue(release.published);
    const modifiedDate = getDiscogsDateValue(release.modified);
    const discogsGenres = keywordsToDiscogsGenres(release.keywords);
    const discogsStyles = keywordsToDiscogsStyles(release.keywords);

    return new Metadata({
      artist: release.releaseItem.artist.asString,
      artists: release.releaseItem.artist.asArray,
      title: release.releaseItem.title,
      label: release.label,
      released: {
        publishedDate,
        modifiedDate
      },
      trackQty: release.tracksQty,
      formatFileType: 'FLAC',
      formatDescription: 'Album',
      freeText: release.quality,
      genres: {
        keywords: release.keywords,
        autoDetectedGenres: discogsGenres,
        autoDetectedStyles: discogsStyles
      },
      releaseUrl: release.url,
      credits: release.credit,
      tracklist: '' // TODO: Implement tracklist
    });
  }
}
