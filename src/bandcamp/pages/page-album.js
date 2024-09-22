import { logInfo } from '../../utils/console';
import { getCurrentUrl } from '../../utils/html';
import { findReleaseByUrl, saveRelease } from '../../utils/storage';
import { getMusicAlbumSchemaData } from '../modules/html.js';
import { createReleaseFromSchema } from '../../utils/schema';

// Setup logic for BC albums page
export function setupPageAlbum() {
  logInfo('Setup page album');
  const schema = getMusicAlbumSchemaData();
  const release = createReleaseFromSchema(schema);
  setupRelease(release);
  setupMessageListener(schema);
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
 */
function setupMessageListener(schema) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'B2D_BC_DATA') {
      sendResponse({
        type: 'TYPE_PAGE_ALBUM',
        schema
      });
    }

    return true;
  });
}
