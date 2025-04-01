import { Music } from './music';
import { ArtistItem } from './artistItem';
import { ReleaseItem } from './releaseItem';
import { IMusic } from 'src/types';

describe('Music', () => {
  let mockArtist: ArtistItem;
  let mockAlbums: ReleaseItem[];

  beforeEach(() => {
    mockArtist = new ArtistItem(
      'https://artist.bandcamp.com',
      'Test Artist',
      'https://image.url',
      new Date('2025-01-01'),
      1
    );

    mockAlbums = [
      new ReleaseItem(
        'https://album1.bandcamp.com',
        'Test Album 1',
        'https://image1.url',
        101,
        'Test Label 1',
        new Date('2025-01-02')
      ),
      new ReleaseItem(
        'https://album2.bandcamp.com',
        'Test Album 2',
        'https://image2.url',
        102,
        'Test Label 2',
        new Date('2025-01-03')
      )
    ];
  });

  describe('constructor', () => {
    it('should create an instance with artist and albums', () => {
      const music = new Music(mockArtist, mockAlbums);

      expect(music.artist).toBe(mockArtist);
      expect(music.albums).toEqual(mockAlbums);
    });
  });

  describe('toStorageData', () => {
    it('should convert Music instance to StorageData format', () => {
      const music = new Music(mockArtist, mockAlbums);
      const storageData = music.toStorageData();

      expect(storageData).toEqual({
        artist: mockArtist.toStorageData(),
        albums: mockAlbums.map((album) => album.toStorageData())
      });
    });
  });

  describe('fromObject', () => {
    it('should create a Music instance from an object', () => {
      const mockData: IMusic = {
        artist: {
          url: 'https://artist.bandcamp.com',
          name: 'Test Artist',
          uuid: '12345',
          image: 'https://image.url',
          visit: new Date('2025-01-01'),
          id: 1
        },
        albums: [
          {
            url: 'https://album1.bandcamp.com',
            artist: 'Test Artist 1',
            title: 'Test Album 1',
            label: 'Test Label 1',
            visit: new Date('2025-01-02'),
            id: 101
          },
          {
            url: 'https://album2.bandcamp.com',
            artist: 'Test Artist 2',
            title: 'Test Album 2',
            label: 'Test Label 1',
            visit: new Date('2025-01-03'),
            id: 102
          }
        ]
      };

      const music = Music.fromObject(mockData);

      expect(music.artist).toBeInstanceOf(ArtistItem);
      expect(music.artist.name).toBe('Test Artist');
      expect(music.albums).toHaveLength(2);
      expect(music.albums[0]).toBeInstanceOf(ReleaseItem);
      expect(music.albums[0].title).toBe('Test Album 1');
      expect(music.albums[1].title).toBe('Test Album 2');
    });
  });
});
