import { StorageData } from 'src/types';
import TrackTime from './trackTime';

export class Track {
  public num: string;
  public title: string;
  public time: TrackTime;

  constructor(num: string, title: string, time: TrackTime) {
    this.num = num;
    this.title = title;
    this.time = time;
  }

  toStorageObject(): StorageData {
    return {
      num: this.num,
      title: this.title,
      time: this.time.value
    };
  }

  /**
   * Create an instance of the Track class from the object.
   */
  static fromStorageObject(obj: StorageData): Track {
    return new Track(
      obj.num,
      obj.title,
      TrackTime.fromString(obj.time || obj.duration)
    );
  }
}
