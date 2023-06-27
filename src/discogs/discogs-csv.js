import { keywordsToDiscogsGenres, keywordsToDiscogsStyles } from "../bandcamp/bandcamp.js";
import { capitalizeEachWord } from "../modules/helpers.js";
import { Release, Track } from "../app/release.js";

export class DiscogsCsv {
  /**
   *
   * @param {String} artist
   * @param {String} title
   * @param {String} label
   * @param {String} catno
   * @param {String} format
   * @param {Array<String>} genres
   * @param {Array<String>} styles
   * @param {Array<Track>} tracks
   * @param {String} notes
   * @param {String} date
   * @param {String} images
   */
  constructor(artist, title, label, catno, format, genres, styles, tracks, notes, date, images) {
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
   * @param {Release} release
   * @return {DiscogsCsv}
   */
  static fromRelease(release) {
    return new DiscogsCsv(
      release.artist,
      release.title,
      release.label,
      'none',
      'File',
      // ["Electronic"],
      // ["Industrial, Dark Ambient"],
      keywordsToDiscogsGenres(release.keywords),
      keywordsToDiscogsStyles(release.keywords),
      release.tracks,
      release.about ? release.about.replaceAll('"', '""') : '',
      release.date.toISOString().split('T')[0],
      release.coverSrc.big
    );
  }

  /**
   * @param {String} genre
   * @returns {DiscogsCsv}
   */
  addGenre(genre) {
    this.genres.push(genre);
    return this;
  }

  /**
   * @param {String} style
   * @returns {DiscogsCsv}
   */
  addStyle(style) {
    this.styles.push(style);
    return this;
  }

  /**
   * @param {String} track
   * @returns {DiscogsCsv}
   */
  addTrack(track) {
    this.tracks.push(track);
    return this;
  }

  /**
   * @returns String
   */
  getGenre() {
    return this.genres.join(', ');
  }

  /**
   * @returns String
   */
  getStyle() {
    return this.styles.join(', ');
  }

  toCsvObject() {
    const tracks = this.tracks.map(track => {
      return capitalizeEachWord(track.title) + ' ' + track.durationText;
    }).join("\r");
    // escape " symbols
    const notes = this.notes ? this.notes.replaceAll('"', '""') : '';

    return {
      artist: `"${this.artist}"`,
      title: `"${this.title}"`,
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
