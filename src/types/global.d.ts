import { Storage } from '../app/core/storage';

declare global {
  var storage: Storage;
}

export type Uuid = string;
export type StorageObject = Music | Release;
export interface UuidMap {
  [key: Uuid]: StorageObject | undefined;
}

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
