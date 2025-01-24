import config from '../../config';
import {
  keywordsToDiscogsGenres,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp';
import { getExtensionManifest } from '../../utils/chrome';
import {
  generateSelfReleasedLabel,
  generateSubmissionNotesDefault
} from '../modules/discogs';
import { getDiscogsDateValue } from './utils';
import { Release } from '../../app/release';
import { convertArtistName } from '../modules/submission';

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

export class MetadataValue {
  value: string;
  variations: string[];

  constructor(value: string, variations: string[] = []) {
    this.value = value;
    this.variations = Array.from(new Set([value, ...variations])) as string[];
  }
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
  submissionNotes: string;

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
    this.artist = new MetadataValue(artist, [convertArtistName(artist)]);
    this.title = new MetadataValue(title);
    this.label = new MetadataValue(label, [generateSelfReleasedLabel(label)]);
    this.format = {
      fileType: new MetadataValue(formatFileType, ['FLAC', 'WAV', 'MP3']),
      qty: new MetadataValue(trackQty.toString()),
      description: new MetadataValue(formatDescription),
      freeText: new MetadataValue('', [
        '24-bit/44.1kHz',
        '320 kbps',
        '128 kbps'
      ])
    };
    this.country = new MetadataValue(country ?? config.metadata.country, [
      config.metadata.country
    ]);
    this.released = released;
    this.tracklist = tracklist;
    this.credits = credits;
    this.genres = genres;
    this.submissionNotes = generateSubmissionNotesDefault(releaseUrl);
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
