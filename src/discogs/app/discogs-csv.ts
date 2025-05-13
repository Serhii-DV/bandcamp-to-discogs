import {
  keywordsToDiscogsGenres,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp';
import { getDiscogsDateValue } from './utils';
import { Metadata } from './metadata';
import { convertArtistName } from '../modules/submission';
import { generateSelfReleasedLabel } from '../modules/discogs';
import { capitalizeEachWord, normalizeRomanNumerals } from '../../utils/string';
import { Track } from 'src/app/track';
import { Release } from 'src/app/release';
interface DiscogsCsvParams {
  artist: string;
  title: string;
  label: string;
  catno: string;
  format: string;
  genres: string[];
  styles: string[];
  tracks: Track[];
  notes: string;
  date: Date;
  images: string;
}

interface CsvRow {
  artist: string;
  title: string;
  label: string;
  catno: string;
  format: string;
  genre: string;
  style: string;
  tracks: string;
  notes: string;
  date: string;
  images: string;
}

/**
 * Represents a Discogs CSV entry.
 */
export class DiscogsCsv {
  artist: string;
  title: string;
  label: string;
  catno: string;
  format: string;
  genres: string[];
  styles: string[];
  tracks: Track[];
  notes: string;
  date: Date;
  images: string;

  constructor({
    artist,
    title,
    label,
    catno,
    format,
    genres,
    styles,
    tracks,
    notes,
    date,
    images
  }: DiscogsCsvParams) {
    this.artist = convertArtistName(artist);
    this.title = title;
    this.label = label;
    this.catno = catno;
    this.format = format;
    this.genres = genres;
    this.styles = styles;
    this.tracks = tracks;
    this.notes = notes;
    this.date = date;
    this.images = images;
  }

  static fromRelease(release: Release): DiscogsCsv {
    const label =
      release.artist.asString === release.label
        ? generateSelfReleasedLabel(release.artist)
        : release.label;
    const metadata = Metadata.fromRelease(release);

    return new DiscogsCsv({
      artist: release.releaseItem.artist.asString,
      title: release.releaseItem.title,
      label: label,
      catno: 'none',
      format: 'File',
      genres: keywordsToDiscogsGenres(release.keywords),
      styles: keywordsToDiscogsStyles(release.keywords),
      tracks: release.tracks,
      notes: JSON.stringify(metadata),
      date: release.published,
      images: release.image
    });
  }

  addGenre(genre: string): DiscogsCsv {
    this.genres.push(genre);
    return this;
  }

  addStyle(style: string): DiscogsCsv {
    this.styles.push(style);
    return this;
  }

  addTrack(track: Track): DiscogsCsv {
    this.tracks.push(track);
    return this;
  }

  getGenre(): string {
    return this.genres
      .filter((genre) => genre !== 'Folk, World, & Country')
      .join(', ');
  }

  getStyle(): string {
    return this.styles.join(', ');
  }

  getDate(): string {
    return getDiscogsDateValue(this.date);
  }

  toCsvObject(): CsvRow {
    const tracks = this.tracks
      .map(
        (track) =>
          `${capitalizeEachWord(normalizeRomanNumerals(track.displayName))} ${track.time.toFormattedString()}`
      )
      .join('\r');
    const notes = this.notes ? this.notes.replace(/"/g, '""') : '';

    return {
      artist: `"${this.artist}"`,
      title: `"${capitalizeEachWord(this.title)}"`,
      label: `"${this.label}"`,
      catno: this.catno,
      format: this.format,
      genre: `"${this.getGenre()}"`,
      style: `"${this.getStyle()}"`,
      tracks: `"${tracks}"`,
      notes: `"${notes}"`,
      date: this.getDate(),
      images: this.images
    };
  }
}
