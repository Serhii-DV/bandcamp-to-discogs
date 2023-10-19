import { Release } from "../app/release.js";
import { getCurrentUrl } from "../modules/html.js";
import { findReleaseByUrl, saveRelease } from "../modules/storage.js";
import { getMusicAlbumSchemaData } from "./html.js";

// Setup logic for BC albums page
export function setupPageAlbum() {
  setupRelease();
  setupSendMessageToPopup();
}

function setupRelease() {
  // Save release data to the storage if it doesn't exist
  findReleaseByUrl(getCurrentUrl(), null, (key) => {
    const schemaData = getMusicAlbumSchemaData();
    const release = Release.fromBandcampSchema(schemaData);
    saveRelease(release);
  });
}

function setupSendMessageToPopup() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getBandcampData') {
      findReleaseByUrl(getCurrentUrl(), release => {
        sendResponse({
          type: 'release',
          data: release.toObject()
        });
      });
    }

    return true;
  });
}
