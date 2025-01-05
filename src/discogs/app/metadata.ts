import config from '../../config.js';
import {
  keywordsToDiscogsGenres,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp.js';
import { getExtensionManifest } from '../../utils/chrome';
import { generateSubmissionNotes } from '../modules/discogs.js';
import { getDiscogsDateValue } from './utils.js';
import { Release } from '../../app/release';

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

export class Metadata {
  version: string;
  artist: string;
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
    this.artist = artist;
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
    this.submissionNotes = generateSubmissionNotes(releaseUrl);
  }

  /**
   * Creates a Metadata instance from a Release object.
   * @param {Release} release - The Release object to convert.
   * @return {Metadata} - The converted Metadata instance.
   */
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
