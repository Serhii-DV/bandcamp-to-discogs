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
import { arrayUnique } from '../../utils/utils';

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
  title: string;
  label: string;
  trackQty: number;
  formatFileType: string;
  formatDescription: string;
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

  constructor({
    artist,
    title,
    label,
    trackQty,
    formatFileType,
    formatDescription,
    country,
    released,
    tracklist,
    credits,
    genres,
    releaseUrl
  }: MetadataParams) {
    const manifest = getExtensionManifest();

    this.version = manifest.version;
    this.artist = convertMetadataValue([artist, convertArtistName(artist)]);
    this.title = convertMetadataValue(title);
    this.label = convertMetadataValue([
      label,
      generateSelfReleasedLabel(label)
    ]);
    this.format = {
      fileType: convertMetadataValue([formatFileType, 'FLAC', 'WAV', 'MP3']),
      qty: convertMetadataValue(trackQty.toString()),
      description: convertMetadataValue(formatDescription),
      freeText: convertMetadataValue(['24-bit/44.1kHz', '320 kbps', '128 kbps'])
    };
    this.country = convertMetadataValue([
      country ?? config.metadata.country,
      config.metadata.country
    ]);
    this.released = released;
    this.tracklist = tracklist;
    this.credits = credits;
    this.genres = genres;
    this.submissionNotes = convertMetadataValue([
      generateSubmissionNotesDefault(releaseUrl),
      generateSubmissionNotesShort(releaseUrl)
    ]);
  }

  static fromRelease(release: Release): Metadata {
    const publishedDate = getDiscogsDateValue(release.published);
    const modifiedDate = getDiscogsDateValue(release.modified);
    const discogsGenres = keywordsToDiscogsGenres(release.keywords);
    const discogsStyles = keywordsToDiscogsStyles(release.keywords);

    return new Metadata({
      artist: release.releaseItem.artist,
      title: release.releaseItem.title,
      label: release.label,
      released: {
        publishedDate,
        modifiedDate
      },
      trackQty: release.tracksQty,
      formatFileType: 'FLAC',
      formatDescription: 'Album',
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
