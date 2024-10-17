import { logInfo } from '../../utils/console';
import { saveRelease } from '../../utils/storage';
import { getMusicAlbumSchemaData } from '../modules/html.js';
import { createReleaseFromSchema } from '../../utils/schema';
import { chromeListenToMessage } from '../../utils/chrome';

// Setup logic for BC albums page
export function setupPageAlbum() {
  logInfo('Setup page album');
  const schema = getMusicAlbumSchemaData();
  const release = createReleaseFromSchema(schema);
  saveRelease(release);
  setupMessageListener(schema);
}

/**
 * @param {Object} schema
 */
function setupMessageListener(schema) {
  chromeListenToMessage((message, sender, sendResponse) => {
    if (message.type === 'B2D_BC_DATA') {
      sendResponse({
        type: 'TYPE_PAGE_ALBUM',
        schema
      });
    }

    return true;
  });
}
