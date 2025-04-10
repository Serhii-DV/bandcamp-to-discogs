import { TrackStorageObject } from 'src/types';
import TrackTime from './trackTime';

export class Track {
  constructor(
    public readonly num: number,
    public readonly title: string,
    public readonly time: TrackTime,
    public readonly artist?: string
  ) {}

  /**
   * Getter for the display name.
   * Returns "artist - title" if artist is set, otherwise "title".
   */
  get displayName(): string {
    return this.artist ? `${this.artist} - ${this.title}` : this.title;
  }

  toStorageObject(): TrackStorageObject {
    return {
      num: this.num.toString(),
      title: this.title,
      time: this.time.value,
      artist: this.artist
    };
  }

  /**
   * Create an instance of the Track class from a storage object.
   */
  static fromStorageObject(obj: TrackStorageObject): Track {
    if (!obj.num || !obj.title || !(obj.time || obj.duration)) {
      throw new Error('Invalid TrackStorageObject');
    }
    return new Track(
      Number(obj.num),
      obj.title,
      TrackTime.fromString(obj.time || obj.duration!),
      obj.artist
    );
  }
}
