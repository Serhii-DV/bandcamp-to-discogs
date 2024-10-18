import { ReleaseItem } from './release';

export class Band {
  public id: number;
  public name: string;
  public url: string;
  public releaseItems: ReleaseItem[];

  constructor(
    id: number,
    name: string,
    url: string,
    releaseItems: ReleaseItem[]
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.releaseItems = releaseItems;
  }
}
