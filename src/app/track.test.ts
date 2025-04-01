import { Track } from './track';
import TrackTime from './trackTime';

describe('Track', () => {
  describe('constructor', () => {
    it('should correctly initialize properties', () => {
      const trackTime = new TrackTime(0, 3, 45);
      const track = new Track(1, 'Test Song', trackTime, 'Test Artist');

      expect(track.num).toBe(1);
      expect(track.title).toBe('Test Song');
      expect(track.time.value).toBe('00:03:45');
      expect(track.artist).toBe('Test Artist');
    });

    it('should correctly handle missing artist', () => {
      const trackTime = new TrackTime(0, 4, 20);
      const track = new Track(2, 'Instrumental Track', trackTime);

      expect(track.artist).toBeUndefined();
      expect(track.displayName).toBe('Instrumental Track');
    });
  });

  describe('displayName', () => {
    it('should return "artist - title" if artist is present', () => {
      const trackTime = new TrackTime(0, 5, 0);
      const track = new Track(3, 'Cool Song', trackTime, 'Cool Band');
      expect(track.displayName).toBe('Cool Band - Cool Song');
    });

    it('should return just the title if no artist is present', () => {
      const trackTime = new TrackTime(0, 2, 30);
      const track = new Track(4, 'Simple Tune', trackTime);
      expect(track.displayName).toBe('Simple Tune');
    });
  });

  describe('toStorageObject', () => {
    it('should convert Track to a storage object correctly', () => {
      const trackTime = new TrackTime(0, 4, 45);
      const track = new Track(5, 'Saved Song', trackTime, 'Saved Artist');
      const storageObject = track.toStorageObject();

      expect(storageObject).toEqual({
        num: '5',
        title: 'Saved Song',
        time: '00:04:45',
        artist: 'Saved Artist'
      });
    });

    it('should handle missing artist correctly in storage object', () => {
      const trackTime = new TrackTime(0, 6, 15);
      const track = new Track(6, 'No Artist Song', trackTime);
      const storageObject = track.toStorageObject();

      expect(storageObject).toEqual({
        num: '6',
        title: 'No Artist Song',
        time: '00:06:15',
        artist: undefined
      });
    });
  });

  describe('fromStorageObject', () => {
    it('should create a Track from a valid storage object', () => {
      const storageObject = {
        num: '7',
        title: 'Loaded Song',
        time: '00:05:30',
        artist: 'Loaded Artist'
      };

      const track = Track.fromStorageObject(storageObject);
      expect(track.num).toBe(7);
      expect(track.title).toBe('Loaded Song');
      expect(track.time.value).toBe('00:05:30');
      expect(track.artist).toBe('Loaded Artist');
    });

    it('should throw an error for an invalid storage object', () => {
      expect(() => Track.fromStorageObject({ title: 'Invalid Song' })).toThrow(
        'Invalid TrackStorageObject'
      );
      expect(() =>
        Track.fromStorageObject({ num: '8', time: '00:03:00' })
      ).toThrow('Invalid TrackStorageObject');
    });

    it('should handle legacy duration field', () => {
      const storageObject = {
        num: '9',
        title: 'Legacy Song',
        time: '00:04:50'
      };

      const track = Track.fromStorageObject(storageObject);
      expect(track.num).toBe(9);
      expect(track.title).toBe('Legacy Song');
      expect(track.time.value).toBe('00:04:50');
      expect(track.artist).toBeUndefined();
    });
  });
});
