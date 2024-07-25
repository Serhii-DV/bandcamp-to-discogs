import { Release } from "../../app/release.js";
import { keywordsToDiscogsGenres, keywordsToDiscogsStyles } from "../../bandcamp/modules/bandcamp.js";
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
    const discogsGenres = keywordsToDiscogsGenres(release.keywords);
    const discogsStyles = keywordsToDiscogsStyles(release.keywords);
    const genres = `Bandcamp keywords: <var>${release.keywords.join(', ')}</var><br>
Auto-detected genres: <var>${discogsGenres.join(', ')}</var><br>
Auto-detected styles: <var>${discogsStyles.join(', ')}</var><br>
`;

    return new Metadata({
      artist: `<var>${release.releaseItem.artist}</var>`,
      title: `<var>${release.releaseItem.title}</var>`,
      label: `<var>${release.label}</var>`,
      released: `Published date: <var>${publishedDate}</var>.<br>Modified date: <var>${modifiedDate}</var>`,
      trackQty: release.tracksQty,
      formatFileType: 'FLAC',
      formatDescription: 'Album',
      genres,
      releaseUrl: release.url
    });
  }
}
