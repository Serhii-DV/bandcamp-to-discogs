import { Release } from "../../app/release.js";
import { getExtensionManifest } from "../../modules/chrome.js";
import { generateSubmissionNotes } from "../modules/discogs.js";

export class Metadata {
  /**
   * @param {String}
   */
  version;

  /**
   * @param {Object}
   */
  format;

  /**
   * @param {String}
   */
  submissionNotes;

  constructor({
    trackQty,
    formatFileType,
    formatDescription,
    releaseUrl
  }) {
    const self = this;
    const manifest = getExtensionManifest();

    self.version = manifest.version;
    self.format = {
      qty: trackQty,
      fileType: formatFileType,
      description: formatDescription
    };
    self.submissionNotes = generateSubmissionNotes(releaseUrl);
  }

  /**
   * Creates a Metadata instance from a Release object.
   * @param {Release} release - The Release object to convert.
   * @return {Metadata} - The converted Metadata instance.
   */
  static fromRelease(release) {
    return new Metadata({
      trackQty: release.tracksQty,
      formatFileType: 'FLAC',
      formatDescription: 'Album',
      releaseUrl: release.url
    });
  }
}
