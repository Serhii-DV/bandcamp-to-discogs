import { Release } from './release';
import { ReleaseItem } from './releaseItem';
import { ReleaseArtist } from './releaseArtist';
import { Track } from './track';
import TrackTime from './trackTime';

describe('Release', () => {
  let mockTracks: Track[];
  let mockRelease: Release;

  beforeEach(() => {
    mockTracks = [
      new Track(1, 'Track 1', TrackTime.fromString('00:03:45'), 'Artist A'),
      new Track(2, 'Track 2', TrackTime.fromString('00:04:30'), 'Artist A')
    ];

    mockRelease = new Release(
      'Test Artist',
      'Test Album',
      'Test Label',
      new Date('2025-01-01'),
      new Date('2025-01-02'),
      mockTracks,
      'https://test.bandcamp.com/album/test-album',
      'https://image.url',
      ['keyword1', 'keyword2'],
      'Test Credit',
      'High Quality'
    );
  });

  describe('constructor', () => {
    it('should create a Release instance with correct properties', () => {
      expect(mockRelease.releaseItem).toBeInstanceOf(ReleaseItem);
      expect(mockRelease.label).toBe('Test Label');
      expect(mockRelease.published).toEqual(new Date('2025-01-01'));
      expect(mockRelease.modified).toEqual(new Date('2025-01-02'));
      expect(mockRelease.tracks).toHaveLength(2);
      expect(mockRelease.tracksQty).toBe(2);
      expect(mockRelease.image).toBe('https://image.url');
      expect(mockRelease.credit).toBe('Test Credit');
      expect(mockRelease.quality).toBe('High Quality');
    });
  });

  describe('getters', () => {
    it('should return artist as ReleaseArtist', () => {
      expect(mockRelease.artist).toBeInstanceOf(ReleaseArtist);
    });

    it('should return correct URL string', () => {
      expect(mockRelease.url).toBe(
        'https://test.bandcamp.com/album/test-album'
      );
    });

    it('should return release hostname without protocol', () => {
      expect(mockRelease.releaseHostname).toBe(
        'test.bandcamp.com/album/test-album'
      );
    });

    it('should return correct title', () => {
      expect(mockRelease.title).toBe('Test Album');
    });

    it('should return UUID from ReleaseItem', () => {
      expect(mockRelease.uuid).toBe('96fd7475-59d4-546e-904d-fe8e1a033a3c');
    });

    it('should return the published year', () => {
      expect(mockRelease.year).toBe(2025);
    });

    it('should return artist hostname and URL', () => {
      expect(mockRelease.artistHostname).toBe('test.bandcamp.com');
      expect(mockRelease.artistUrl).toBe('https://test.bandcamp.com');
    });
  });

  describe('toStorageObject', () => {
    it('should correctly convert Release to storage object', () => {
      const storageObj = mockRelease.toStorageObject();

      expect(storageObj).toEqual({
        artist: 'Test Artist',
        title: 'Test Album',
        url: 'https://test.bandcamp.com/album/test-album',
        label: 'Test Label',
        published: '2025-01-01T00:00:00.000Z',
        modified: '2025-01-02T00:00:00.000Z',
        tracks: [
          { num: '1', title: 'Track 1', time: '00:03:45', artist: 'Artist A' },
          { num: '2', title: 'Track 2', time: '00:04:30', artist: 'Artist A' }
        ],
        image: 'https://image.url',
        keywords: ['keyword1', 'keyword2'],
        credit: 'Test Credit',
        quality: 'High Quality'
      });
    });
  });

  describe('fromStorageObject', () => {
    it('should create a Release instance from a storage object', () => {
      const mockData = {
        artist: 'Test Artist',
        title: 'Test Album',
        label: 'Test Label',
        published: '2025-01-01T00:00:00.000Z',
        modified: '2025-01-02T00:00:00.000Z',
        tracks: [
          { num: '1', title: 'Track 1', time: '00:03:45', artist: 'Artist A' },
          { num: '2', title: 'Track 2', time: '00:04:30', artist: 'Artist A' }
        ],
        url: 'https://test.bandcamp.com/album/test-album',
        image: 'https://image.url',
        keywords: ['keyword1', 'keyword2'],
        credit: 'Test Credit',
        quality: 'High Quality'
      };

      const release = Release.fromStorageObject(mockData);

      expect(release).toBeInstanceOf(Release);
      expect(release.artist).toBeInstanceOf(ReleaseArtist);
      expect(release.title).toBe('Test Album');
      expect(release.tracks).toHaveLength(2);
      expect(release.tracks[0]).toBeInstanceOf(Track);
      expect(release.tracks[1].title).toBe('Track 2');
    });

    it('should throw an error if URL or tracks are missing', () => {
      expect(() => Release.fromStorageObject({})).toThrow(
        'Cannot create Release object from object'
      );
    });

    it('should throw an error if published or modified date is missing', () => {
      const invalidData = {
        artist: 'Test Artist',
        title: 'Test Album',
        label: 'Test Label',
        tracks: [],
        url: 'https://test.bandcamp.com/album/test-album',
        image: 'https://image.url',
        keywords: ['keyword1', 'keyword2'],
        credit: 'Test Credit',
        quality: 'High Quality'
      };

      expect(() => Release.fromStorageObject(invalidData)).toThrow(
        'Missing published or date property'
      );
    });
  });
});
