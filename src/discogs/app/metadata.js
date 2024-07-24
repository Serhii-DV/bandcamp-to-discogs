import { Release } from "../../app/release.js";
import { getExtensionManifest } from "../../modules/chrome.js";
import { generateSubmissionNotes } from "../modules/discogs.js";
import { getDiscogsDateValue } from "./utils.js";

export class Metadata {
  /**
   * @param {String}
   */
  version;

  /**
   * @param {String}
   */
  artists;

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
   * @param {String}
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
    artists,
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
    self.artists = artists;
    self.title = title;
    self.label = label;
    self.format = {
      qty: trackQty,
      fileType: formatFileType,
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

    return new Metadata({
      artists: release.releaseItem.artist,
      title: release.releaseItem.title,
      label: release.label,
      released: `Published date: ${publishedDate}. Modified date: ${modifiedDate}`,
      trackQty: release.tracksQty,
      formatFileType: 'FLAC',
      formatDescription: 'Album',
      genres: release.keywords.join(', '),
      releaseUrl: release.url
    });
  }
}
