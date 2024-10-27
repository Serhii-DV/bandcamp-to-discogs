import { Storage } from '../app/core/storage';

declare global {
  var storage: Storage;
}

export type Uuid = string;
export interface UuidMap {
  [key: Uuid]: any;
}

interface IArtistItem {
  name: string;
  url: string;
  uuid: string;
  image?: string;
  visit?: Date;
  id?: number;
}

interface IReleaseItem {
  url: string;
  artist: string;
  title: string;
  label?: string;
  visit?: Date;
  id?: number;
}

interface IMusic {
  artist: IArtistItem;
  albums: IReleaseItem[];
}

export {};
