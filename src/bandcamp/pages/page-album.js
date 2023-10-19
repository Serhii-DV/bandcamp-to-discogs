import { Release } from "../../app/release.js";
import { getCurrentUrl } from "../../modules/html.js";
import { findReleaseByUrl, saveRelease } from "../../modules/storage.js";
import { getMusicAlbumSchemaData } from "../modules/html.js";

// Setup logic for BC albums page
export function setupPageAlbum() {
  const schema = getMusicAlbumSchemaData();
  const release = Release.fromBandcampSchema(schema);
  setupRelease(release);
  setupSendMessageToPopup(release);
}

/**
 * @param {Release} release
 */
function setupRelease(release) {
  // Save release data to the storage if it doesn't exist
  findReleaseByUrl(getCurrentUrl(), null, (key) => {
    saveRelease(release);
  });
}

/**
 * @param {Release} release
 */
function setupSendMessageToPopup(release) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getBandcampData') {
      sendResponse({
        type: 'release',
        data: release.toObject()
      });
    }

    return true;
  });
}
