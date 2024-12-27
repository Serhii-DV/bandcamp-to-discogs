import { TrackStorageObject } from 'src/types';
import TrackTime from './trackTime';

export class Track {
  constructor(
    public readonly num: string,
    public readonly title: string,
    public readonly time: TrackTime
  ) {}

  toStorageObject(): TrackStorageObject {
    return {
      num: this.num,
      title: this.title,
      time: this.time.value
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
      obj.num,
      obj.title,
      TrackTime.fromString(obj.time || obj.duration!)
    );
  }
}
