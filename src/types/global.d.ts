import { Storage } from '../app/core/storage';

declare global {
  var storage: Storage;
}

export type Uuid = string;
export type StorageObject = Music | Release;
export interface UuidMap {
  [key: Uuid]: StorageObject | undefined;
}
export interface History extends Array<Date> {}
export type HistoryItem = chrome.history.HistoryItem;

export type GetUrlHistoryCallback = (history: History) => void;
export type GetLatestVisitDateCallback = (latestVisit: Date | null) => void;
export type GetLatestVisitsCallback = (results: HistoryItem[]) => void;

export interface IArtistItem {
  name: string;
  url: string;
  uuid: string;
  image?: string;
  visit?: Date;
  id?: number;
}

export interface IReleaseItem {
  url: string;
  artist: string;
  title: string;
  label?: string;
  visit?: Date;
  id?: number;
}

export interface IMusic {
  artist: IArtistItem;
  albums: IReleaseItem[];
}

export {};
