import config from '../../config';
import {
  keywordsToDiscogsGenres,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp';
import { getExtensionManifest } from '../../utils/chrome';
import { generateSubmissionNotesDefault } from '../modules/discogs';
import { getDiscogsDateValue } from './utils';
import { Release } from '../../app/release';
import { convertArtistName } from '../modules/submission';

interface Format {
  fileType: string;
  qty: number;
  description: string;
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
  original: string;
  value: string;
  variations: string[];

  constructor(original: string, value: string, variations: string[] = []) {
    this.original = original;
    this.value = value;
    this.variations = Array.from(
      new Set(original === value ? variations : [value, ...variations])
    ) as string[];
  }
}

export class Metadata {
  version: string;
  artist: MetadataValue;
  title: string;
  label: string;
  format: Format;
  country: string;
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
    this.artist = new MetadataValue(artist, convertArtistName(artist));
    this.title = title;
    this.label = label;
    this.format = {
      fileType: formatFileType,
      qty: trackQty,
      description: formatDescription
    };
    this.country = country ?? config.metadata.country;
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
