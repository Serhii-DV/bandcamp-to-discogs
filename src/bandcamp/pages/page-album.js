import { Release, Track } from '../../app/release.js';
import TrackTime from '../../app/trackTime.js';
import { getCurrentUrl } from '../../utils/html';
import { findReleaseByUrl, saveRelease } from '../../utils/storage';
import { getMusicAlbumSchemaData } from '../modules/html.js';

// Setup logic for BC albums page
export function setupPageAlbum() {
  const schema = getMusicAlbumSchemaData();
  const release = createReleaseFromSchema(schema);
  setupRelease(release);
  setupSendMessageToPopup(schema, release);
}

/**
 * @param {Object} schema
 * @returns {Release}
 */
function createReleaseFromSchema(schema) {
  const artist = schema.byArtist.name;
  const title = schema.name;
  const label = schema.publisher.name;
  const datePublished = new Date(schema.datePublished);
  const dateModified = new Date(schema.dateModified);
  const tracks = schema.track.numberOfItems
    ? schema.track.itemListElement.map(
        (track) =>
          new Track(
            track.position,
            track.item.name,
            TrackTime.fromDuration(track.item.duration)
          )
      )
    : [];
  const url = schema.mainEntityOfPage;
  const image = schema.image;
  const keywords = schema.keywords;

  return new Release(
    artist,
    title,
    label,
    datePublished,
    dateModified,
    tracks,
    url,
    image,
    keywords
  );
}

/**
 * @param {Release} release
 */
function setupRelease(release) {
  // Save release data to the storage if it doesn't exist
  findReleaseByUrl(getCurrentUrl(), null, () => {
    saveRelease(release);
  });
}

/**
 * @param {Object} schema
 * @param {Release} release
 */
function setupSendMessageToPopup(schema, release) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getBandcampData') {
      sendResponse({
        type: 'release',
        data: release.toStorageObject(),
        schema: schema
      });
    }

    return true;
  });
}
