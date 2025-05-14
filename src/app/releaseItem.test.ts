import { ReleaseItem } from './releaseItem';
import { ReleaseArtist } from './releaseArtist';

describe('ReleaseItem', () => {
  const url = 'https://example.bandcamp.com/album/sample-album';
  const artist = 'Band Name';
  const title = 'Sample Album';
  const id = 123;
  const label = 'Sample Label';
  const visitDate = new Date('2025-01-01T12:00:00Z');

  describe('constructor', () => {
    it('should correctly initialize properties', () => {
      const releaseItem = new ReleaseItem(
        url,
        artist,
        title,
        id,
        label,
        visitDate
      );

      expect(releaseItem.url.toString()).toBe(url);
      expect(releaseItem.artist).toBeInstanceOf(ReleaseArtist);
      expect(releaseItem.artist.toString()).toBe(artist);
      expect(releaseItem.title).toBe(title);
      expect(releaseItem.label).toBe(label);
      expect(releaseItem.id).toBe(id);
      expect(releaseItem.visit).toEqual(visitDate);
    });

    it('should set label as an empty string if not provided', () => {
      const releaseItem = new ReleaseItem(url, artist, title);
      expect(releaseItem.label).toBe('');
    });

    it('should handle undefined visit date', () => {
      const releaseItem = new ReleaseItem(url, artist, title, id, label);
      expect(releaseItem.visit).toBeUndefined();
    });
  });

  describe('artists getter', () => {
    it('should return an array of artist names', () => {
      const releaseItem = new ReleaseItem(url, 'Artist1 & Artist2', title);
      expect(releaseItem.artists).toEqual(['Artist1', 'Artist2']);
    });
  });

  describe('toStorageData', () => {
    it('should correctly convert ReleaseItem to StorageData format', () => {
      const releaseItem = new ReleaseItem(
        url,
        artist,
        title,
        id,
        label,
        visitDate
      );
      const storageData = releaseItem.toStorageData();

      expect(storageData).toEqual({
        url,
        artist,
        title,
        label,
        image: undefined,
        visit: visitDate.toISOString(),
        id
      });
    });

    it('should handle missing optional fields in StorageData', () => {
      const releaseItem = new ReleaseItem(url, artist, title);
      const storageData = releaseItem.toStorageData();

      expect(storageData).toEqual({
        url,
        artist,
        title,
        label: '',
        image: undefined,
        visit: undefined,
        id: undefined
      });
    });
  });

  describe('fromObject', () => {
    it('should correctly create a ReleaseItem from an object', () => {
      const obj = {
        url,
        artist,
        title,
        id,
        label,
        visit: visitDate.toISOString()
      };

      const releaseItem = ReleaseItem.fromObject(obj);

      expect(releaseItem.url.toString()).toBe(url);
      expect(releaseItem.artist.toString()).toBe(artist);
      expect(releaseItem.title).toBe(title);
      expect(releaseItem.label).toBe(label);
      expect(releaseItem.id).toBe(id);
      expect(releaseItem.visit).toEqual(visitDate);
    });

    it('should handle missing optional fields gracefully', () => {
      const obj = {
        url,
        artist,
        title
      };

      const releaseItem = ReleaseItem.fromObject(obj);

      expect(releaseItem.url.toString()).toBe(url);
      expect(releaseItem.artist.toString()).toBe(artist);
      expect(releaseItem.title).toBe(title);
      expect(releaseItem.label).toBe('');
      expect(releaseItem.id).toBeUndefined();
      expect(releaseItem.visit).toBeUndefined();
    });
  });
});
