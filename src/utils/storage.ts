import { Storage } from 'src/app/core/storage';
import { validate as isUUID } from 'uuid';

// Storage utilities
export function removeNonUuidRecordsFromStorage(storage: Storage): void {
  storage.get(['maintenance']).then((item) => {
    if (item.maintenance && item.maintenance.removedNonUuidKeys) return;

    storage.getAll().then((storageData) => {
      const removeKeys: string[] = [];
      for (const key in storageData) {
        if (isUUID(key)) continue;

        removeKeys.push(key);
      }

      storage.remove(removeKeys).then(() => {
        storage.set('maintenance', { removedNonUuidKeys: true });
      });
    });
  });
}
