import { containsOneOf, splitString } from '../utils/utils';

export class ReleaseArtist {
  public names: string[];
  public joins: string[];

  constructor(names: string[], joins: string[] = []) {
    this.names = names;
    this.joins = joins.map((join) => join.trim());
  }

  get asString(): string {
    return this.toString();
  }

  get asArray(): string[] {
    const result: string[] = [];
    for (let i = 0; i < this.names.length; i++) {
      result.push(this.names[i]);
      if (i < this.joins.length) {
        result.push(this.joins[i]);
      }
    }
    return result;
  }

  static fromString(input: string): ReleaseArtist {
    const useOriginal = containsOneOf(input, ['V/A']);
    const names: string[] = useOriginal
      ? [input]
      : splitString(input, /[,\/+•|]| Vs | & +/);
    const joins: string[] = useOriginal
      ? []
      : (input.match(/[,\/+•|]| Vs | & +/g) || []).map((join) => join.trim());
    return new ReleaseArtist(names, joins);
  }

  toString(): string {
    return this.asArray.join(' ');
  }
}
