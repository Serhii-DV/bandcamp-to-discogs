import {
  keywordsToDiscogsGenres,
  keywordsToDiscogsStyles
} from '../../bandcamp/modules/bandcamp.js';
import { getExtensionManifest } from '../../utils/chrome';
import { generateSubmissionNotes } from '../modules/discogs.js';
import { getDiscogsDateValue } from './utils.js';

export class Metadata {
  /**
   * @param {String}
   */
  version;

  /**
   * @param {String}
   */
  artist;

  /**
   * @param {String}
   */
  title;

  /**
   * @param {String}
   */
  label;

  /**
   * @param {Object}
   */
  format;

  /**
   * @param {String}
   */
  country;

  /**
   * @param {Array}
   */
  released;

  /**
   * @param {String}
   */
  tracklist;

  /**
   * @param {String}
   */
  credits;

  /**
   * @param {String}
   */
  genres;

  /**
   * @param {String}
   */
  submissionNotes;

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
  }) {
    const self = this;
    const manifest = getExtensionManifest();

    self.version = manifest.version;
    self.artist = artist;
    self.title = title;
    self.label = label;
    self.format = {
      fileType: formatFileType,
      qty: trackQty,
      description: formatDescription
    };
    self.country = country;
    self.released = released;
    self.tracklist = tracklist;
    self.credits = credits;
    self.genres = genres;
    self.submissionNotes = generateSubmissionNotes(releaseUrl);
  }

  /**
   * Creates a Metadata instance from a Release object.
   * @param {Release} release - The Release object to convert.
   * @return {Metadata} - The converted Metadata instance.
   */
  static fromRelease(release) {
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
      releaseUrl: release.url
    });
  }
}
