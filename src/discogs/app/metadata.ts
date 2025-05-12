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
import { capitalizeEachWord, removeYearInBrackets } from '../../utils/string';
import { Credit, extractCredits } from '../../app/credit';
import { MetadataValue, convertMetadataValue } from './metadataValue';

export interface Format {
  fileType: MetadataValue;
  qty: MetadataValue;
  description: MetadataValue;
  freeText: MetadataValue;
}

interface Artist {
  name: string;
  join: string;
}

interface ArtistMetadataValue {
  name: MetadataValue;
  join: string;
}

export interface ArtistMetadata {
  value: string;
  artists: ArtistMetadataValue[];
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

interface Credits {
  text: string;
  items: Credit[];
}

interface MetadataParams {
  artist: string;
  artists: Artist[];
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

export class Metadata {
  version: string;
  artist: ArtistMetadata;
  title: MetadataValue;
  label: MetadataValue;
  format: Format;
  country: MetadataValue;
  released: Released;
  tracklist: string;
  credits: Credits;
  genres: Genres;
  submissionNotes: MetadataValue;

  constructor(params: MetadataParams) {
    const manifest = getExtensionManifest();

    this.version = manifest.version;

    this.artist = {
      value: params.artist,
      artists: params.artists.map((artist) => ({
        name: convertMetadataValue([
          artist.name,
          capitalizeEachWord(artist.name),
          convertArtistName(artist.name)
        ]),
        join: artist.join
      }))
    };

    this.title = convertMetadataValue([
      params.title,
      capitalizeEachWord(params.title),
      removeYearInBrackets(params.title)
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
    this.credits = {
      text: params.credits,
      items: extractCredits(params.credits)
    };
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

    const artists: Artist[] = [];
    release.releaseItem.artist.names.forEach((name, index) => {
      const join = release.releaseItem.artist.joins[index] || '';
      artists.push({
        name,
        join
      });
    });

    return new Metadata({
      artist: release.releaseItem.artist.asString,
      artists,
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
