import { StorageData, StorageDataMap, Uuid, UuidMap } from 'src/types';
import { log } from '../../utils/console';
import { Release } from '../release';
import { Music } from '../music';
import { hasOwnProperty, isObject } from '../../utils/utils';
import { validate as isUUID } from 'uuid';

export class Storage {
  private storage: chrome.storage.StorageArea;

  constructor(storage: chrome.storage.StorageArea = chrome.storage.local) {
    this.storage = storage;
  }

  async get(keys: string[]): Promise<StorageDataMap> {
    return new Promise((resolve, reject) => {
      this.storage.get(keys, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        resolve(items);
      });
    });
  }

  async set(key: string, data: StorageData): Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.set({ [key]: data }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        log('[Storage] Set by key', key, data);
        resolve();
      });
    });
  }

  async getByUuids(uuids: Uuid[]): Promise<UuidMap> {
    const self = this;

    return self.get(uuids).then((storageDataMap) => {
      return self.storageDataMapToUuidMap(storageDataMap);
    });
  }

  async setByUuid(uuid: string, data: StorageData): Promise<void> {
    return this.set(uuid, data);
  }

  private storageDataMapToUuidMap(storageDataMap: StorageDataMap): UuidMap {
    const uuidMap: UuidMap = {};

    for (const key in storageDataMap) {
      if (
        !hasOwnProperty(storageDataMap, key) ||
        !isObject(storageDataMap[key]) ||
        !isUUID(key)
      ) {
        continue;
      }

      const obj = storageDataMap[key];

      try {
        uuidMap[key] = Release.fromStorageObject(obj);
      } catch (error) {
        try {
          uuidMap[key] = Music.fromObject(obj);
        } catch (error) {
          log('Broken storage object.', JSON.stringify(error), obj);
        }
      }
    }
    log('UUID Map', uuidMap);

    return uuidMap;
  }
}
