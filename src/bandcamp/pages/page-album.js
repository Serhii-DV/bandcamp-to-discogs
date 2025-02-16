import { logInfo } from '../../utils/console';
import { getMusicAlbumSchemaData } from '../modules/html';
import { createReleaseFromSchema } from '../../utils/schema';
import { chromeListenToMessage } from '../../utils/chrome';
import { Storage } from '../../app/core/storage';
import { MessageType } from '../../app/core/messageType';

const storage = new Storage();

// Setup logic for BC albums page
export function setupPageAlbum(pageType) {
  logInfo('Setup page album');
  const schema = getMusicAlbumSchemaData();
  const release = createReleaseFromSchema(schema);
  storage.save(release);

  chromeListenToMessage((message, sender, sendResponse) => {
    if (message.type === MessageType.BandcampData) {
      sendResponse({
        pageType: pageType.value,
        uuid: release.uuid,
        schema
      });
    }

    return true;
  });
}
