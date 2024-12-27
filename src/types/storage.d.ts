export interface StorageData {
  [key: string]: any;
}

export type StorageDataMap = StorageData;

export interface TrackStorageObject extends StorageData {
  num: string;
  title: string;
  time: string;
  duration?: string;
}
