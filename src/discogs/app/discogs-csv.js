import { keywordsToDiscogsGenres, keywordsToDiscogsStyles } from "../../bandcamp/modules/bandcamp.js";
import { capitalizeEachWord, removeLeadingZeroOrColon } from "../../modules/utils.js";
import { Release, Track } from "../../app/release.js";

/**
 * Represents a Discogs CSV entry.
 */
export class DiscogsCsv {
  /**
   * Creates a new DiscogsCsv instance.
   * @param {Object} params - The parameters for the DiscogsCsv.
   * @param {String} params.artist - The artist name.
   * @param {String} params.title - The release title.
   * @param {String} params.label - The label name.
   * @param {String} params.catno - The catalog number.
   * @param {String} params.format - The release format.
   * @param {Array<String>} params.genres - The genres associated with the release.
   * @param {Array<String>} params.styles - The styles associated with the release.
   * @param {Array<Track>} params.tracks - The tracks included in the release.
   * @param {String} params.notes - Additional notes.
   * @param {String} params.date - The release date.
   * @param {String} params.images - The image URLs associated with the release.
   */
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
  }) {
    this.artist = artist;
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

  /**
   * Creates a DiscogsCsv instance from a Release object.
   * @param {Release} release - The Release object to convert.
   * @return {DiscogsCsv} - The converted DiscogsCsv instance.
   */
  static fromRelease(release) {
    const label = release.artist === release.label ? `Not On Label (${release.artist} Self-released)` : release.label;

    return new DiscogsCsv({
      artist: release.releaseItem.artist,
      title: release.releaseItem.title,
      label: label,
      catno: 'none',
      format: 'File',
      genres: keywordsToDiscogsGenres(release.keywords),
      styles: keywordsToDiscogsStyles(release.keywords),
      tracks: release.tracks,
      notes: JSON.stringify(release.toMetadata()),
      date: release.datePublished.toISOString().split('T')[0],
      images: release.image
    });
  }

  /**
   * Adds a genre to the release.
   * @param {String} genre - The genre to add.
   * @returns {DiscogsCsv} - The updated DiscogsCsv instance.
   */
  addGenre(genre) {
    this.genres.push(genre);
    return this;
  }

  /**
   * Adds a style to the release.
   * @param {String} style - The style to add.
   * @returns {DiscogsCsv} - The updated DiscogsCsv instance.
   */
  addStyle(style) {
    this.styles.push(style);
    return this;
  }

  /**
   * Adds a track to the release.
   * @param {String} track - The track to add.
   * @returns {DiscogsCsv} - The updated DiscogsCsv instance.
   */
  addTrack(track) {
    this.tracks.push(track);
    return this;
  }

  /**
   * Retrieves the concatenated genre string.
   * @returns {String} - The concatenated genre string.
   */
  getGenre() {
    return this.genres.filter(genre => genre !== 'Folk, World, & Country').join(', ');
  }

  /**
   * Retrieves the concatenated style string.
   * @returns {String} - The concatenated style string.
   */
  getStyle() {
    return this.styles.join(', ');
  }

  /**
   * Converts the DiscogsCsv instance to a CSV object.
   * @returns {Object} - The CSV object representing the csv row object.
   */
  toCsvObject() {
    const tracks = this.tracks
      .map(track => `${capitalizeEachWord(track.title)} ${removeLeadingZeroOrColon(track.time.value)}`)
      .join("\r");
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
      date: this.date,
      images: this.images
    };
  }
}
