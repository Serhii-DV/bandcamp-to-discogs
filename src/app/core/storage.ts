import {
  StorageData,
  StorageDataMap,
  StorageObject,
  Uuid,
  UuidMap
} from 'src/types';
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

        log('[Storage] Get by keys', keys);
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

  async getUuidMap(uuids: Uuid[]): Promise<UuidMap> {
    const self = this;

    return self.get(uuids).then((storageDataMap) => {
      return self.storageDataMapToUuidMap(storageDataMap);
    });
  }

  async getByUuids(uuids: Uuid[]): Promise<StorageObject[]> {
    return this.getUuidMap(uuids).then((uuidMap) => {
      return uuids.map((uuid) => uuidMap[uuid]).filter(Boolean);
    });
  }

  async getByUuid(uuid: Uuid): Promise<StorageObject | undefined> {
    return this.getUuidMap([uuid]).then((uuidMap) => {
      return uuidMap[uuid];
    });
  }

  async setByUuid(uuid: Uuid, data: StorageData): Promise<void> {
    return this.set(uuid, data);
  }

  async save(obj: StorageObject): Promise<void> {
    const self = this;

    if (obj instanceof Music) {
      return self.setByUuid(obj.artist.uuid, obj.toStorageData());
    }

    return self.setByUuid(obj.uuid, obj.toStorageObject());
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
          log('[Storage] Broken storage object.', JSON.stringify(error), obj);
        }
      }
    }
    log('[Storage] UUID Map', uuidMap);

    return uuidMap;
  }
}
