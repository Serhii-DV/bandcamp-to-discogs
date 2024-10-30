import { logInfo } from '../../utils/console';
import { getMusicAlbumSchemaData } from '../modules/html.js';
import { createReleaseFromSchema } from '../../utils/schema';
import { chromeListenToMessage } from '../../utils/chrome';
import { Storage } from '../../app/core/storage';

const storage = new Storage();

// Setup logic for BC albums page
export function setupPageAlbum(pageType) {
  logInfo('Setup page album');
  const schema = getMusicAlbumSchemaData();
  const release = createReleaseFromSchema(schema);
  storage.save(release);

  chromeListenToMessage((message, sender, sendResponse) => {
    if (message.type === 'B2D_BC_DATA') {
      sendResponse({
        pageType: pageType.value,
        uuid: release.uuid,
        schema
      });
    }

    return true;
  });
}
