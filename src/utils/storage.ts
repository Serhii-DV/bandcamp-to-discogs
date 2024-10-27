import { Release } from '../app/release.js';
import { log, logError } from './console';
import {
  getArrLastElement,
  getOwnProperty,
  hasOwnProperty,
  isArray,
  isFunction,
  isObject
} from './utils';
import { validate as isUUID } from 'uuid';

const storage = chrome.storage.local;

export type uuid = string;

interface StorageData {
  [key: string]: any;
}

export interface History extends Array<Date> {}

export interface HistoryData {
  [key: uuid]: History;
}

interface ReleaseMap {
  [key: uuid]: Release;
}

export interface VisitedDate {
  uuid: uuid;
  date: Date;
}

export function logStorageData() {
  storage.get(null).then((data) => log('Storage data', data));
}

export function getAllReleases(): Promise<Release[]> {
  return storage.get(null).then((storageData: StorageData) => {
    return storageDataToReleases(storageData);
  });
}

export function getReleaseByUuid(uuid: string): Promise<Release | undefined> {
  return storage.get([uuid]).then((storageData: StorageData) => {
    const releaseData = storageData[uuid];

    try {
      return Release.fromStorageObject(releaseData);
    } catch (error) {
      log('Broken storage data for release', releaseData);
      clearStorageByKey(uuid);
    }

    return undefined;
  });
}

export function getReleaseMapByUuids(uuids: string[]): Promise<ReleaseMap> {
  return storage.get(uuids).then((storageData: StorageData) => {
    return storageDataToReleaseMap(storageData);
  });
}

export function getReleasesByUuids(uuids: string[]): Promise<Release[]> {
  return storage.get(uuids).then((storageData: StorageData) => {
    return storageDataToReleases(storageData);
  });
}

function releaseMapToReleases(releaseMap: ReleaseMap): Release[] {
  return Object.values(releaseMap);
}

function storageDataToReleases(storageData: StorageData): Release[] {
  return releaseMapToReleases(storageDataToReleaseMap(storageData));
}

function storageDataToReleaseMap(storageData: StorageData): ReleaseMap {
  const releasesMap: ReleaseMap = {};

  for (const key in storageData) {
    if (
      !hasOwnProperty(storageData, key) ||
      !isObject(storageData[key]) ||
      !isUUID(key)
    ) {
      continue;
    }

    const obj = storageData[key];

    try {
      releasesMap[key] = Release.fromStorageObject(obj);
    } catch (error) {
      log('Broken release storage object.', JSON.stringify(error), obj);
      continue;
    }
  }

  return releasesMap;
}

/**
 * Saves a Release object to local storage.
 */
export function saveRelease(release: Release): void {
  storage.set({ [release.uuid]: release.toStorageObject() }).then(() => {
    log('Release saved in the local storage', release.uuid);
    addReleaseHistory(release);
  });
}

export function addReleaseHistory(release: Release): void {
  const uuid = release.uuid;
  getHistoryByUuid(uuid).then((historyData) => {
    const history = getOwnProperty(historyData, uuid, []);
    history.push(new Date());
    setHistoryByUuid(uuid, history).then(() => {
      log('New history added to release', uuid);
    });
  });
}

export function getHistoryByUuid(uuid: string): Promise<HistoryData> {
  const historyKey = generateHistoryKey(uuid);
  return storage.get([historyKey]).then((result) => {
    const historyData: HistoryData = {};
    historyData[uuid] = dateStringsToDateObjects(
      getOwnProperty(result, historyKey, [])
    );
    return historyData;
  });
}

function dateStringsToDateObjects(dates: string[]): Date[] {
  return dates.map((dateString) => new Date(dateString));
}

function dateObjectsToDateStrings(dates: Date[]): string[] {
  return dates.map((date) => date.toISOString());
}

export function setHistoryByUuid(
  uuid: string,
  history: History
): Promise<void> {
  const key = generateHistoryKey(uuid);
  return storage.set({ [key]: dateObjectsToDateStrings(history) });
}

export function getHistoryData(): Promise<HistoryData> {
  return storage.get(null).then((storageData: StorageData) => {
    const historyData: HistoryData = {};

    for (const key in storageData) {
      if (!key.startsWith(HISTORY_KEY_PREFIX)) continue;
      const uuid = key.slice(HISTORY_KEY_PREFIX.length);
      if (!isUUID(uuid)) continue;
      historyData[uuid] = dateStringsToDateObjects(storageData[key]);
    }

    return historyData;
  });
}

export function getLatestHistoryData(
  limit: number
): Promise<Array<VisitedDate>> {
  return getHistoryData().then((historyData) => {
    const visitedDates: Array<VisitedDate> = [];

    for (const uuid in historyData) {
      const lastDate = getArrLastElement(getOwnProperty(historyData, uuid, []));
      if (lastDate) {
        visitedDates.push({ uuid, date: new Date(lastDate) });
      }
    }

    const sortedByDateDesc = visitedDates.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    const lastTenEntries = sortedByDateDesc.slice(0, limit);

    return lastTenEntries;
  });
}

const HISTORY_KEY_PREFIX = 'history.';
const generateHistoryKey = (uuid: string) => HISTORY_KEY_PREFIX + uuid;

/**
 * Clears all data from local storage.
 */
export function clearStorage(): void {
  storage.clear();
}

/**
 * Clears storage items by their keys and executes a callback when done.
 */
export function clearStorageByKey(
  key: string | string[],
  onDone?: () => void
): void {
  if (isArray(key)) {
    (key as string[]).forEach((k) => clearStorageByKey(k, onDone));
    return;
  }

  storage.remove(key, () => {
    if (chrome.runtime.lastError) {
      logError(
        `Error clearing local storage item with key "${key}": ${chrome.runtime.lastError.message}`
      );
    }
    if (onDone && isFunction(onDone)) {
      onDone();
    }
  });
}

/**
 * Retrieves the total number of bytes in use by the storage and invokes the callback with this value.
 */
export function getStorageSize(callback: (bytesInUse: number) => void) {
  if (typeof storage.getBytesInUse === 'function') {
    // Chrome supports getBytesInUse
    storage.getBytesInUse(null, callback);
  } else {
    // Fallback for Firefox
    storage.get(null, (items) => {
      const byteSize = Object.values(items).reduce((total, item) => {
        return (
          total +
          (typeof item === 'string' ? item.length : JSON.stringify(item).length)
        );
      }, 0);
      callback(byteSize);
    });
  }
}
