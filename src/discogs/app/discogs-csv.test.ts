import { DiscogsCsv } from './discogs-csv';
import { Track } from 'src/app/track';
import { Release } from 'src/app/release';
import * as bandcampModule from '../../bandcamp/modules/bandcamp';
import * as discogsModule from '../modules/discogs';
import * as utilsModule from './utils';
import TrackTime from 'src/app/trackTime';
import { Metadata } from './metadata';

// Set up mocks
jest.mock('../../bandcamp/modules/bandcamp', () => ({
  keywordsToDiscogsGenres: jest.fn().mockReturnValue(['Electronic']),
  keywordsToDiscogsStyles: jest.fn().mockReturnValue(['Techno'])
}));

jest.mock('../modules/discogs', () => ({
  generateSelfReleasedLabel: jest.fn().mockReturnValue('Self-Released'),
  generateSubmissionNotesDefault: jest.fn(
    (url) => `Submission Notes for ${url}`
  ),
  generateSubmissionNotesShort: jest.fn((url) => `Short Notes for ${url}`)
}));

jest.mock('./utils', () => ({
  getDiscogsDateValue: jest.fn().mockReturnValue('2023-01-01')
}));

jest.mock('../modules/submission', () => ({
  convertArtistName: jest.fn((name) => `Converted ${name}`)
}));

jest.mock('../../config', () => ({
  default: {
    discogs: {
      draft: {
        self_released: 'Self-Released ({artist})',
        submission_notes: {
          default: 'Default notes for {release_url}',
          short: 'Short notes for {release_url}'
        }
      }
    },
    metadata: {
      country: 'United States'
    }
  }
}));

// Mock the Metadata class
jest.mock('./metadata');

describe('DiscogsCsv', () => {
  // Create test data
  const track = new Track(1, 'Test Track', new TrackTime(0, 3, 21));
  const release = new Release(
    'Test Artist',
    'Test Album',
    'Test Label',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    [track],
    'https://testartist.bandcamp.com/album/test-album',
    'https://example.com/image.jpg',
    ['electronic', 'ambient'],
    'Test Credit',
    'Test Quality'
  );

  const baseParams = {
    artist: 'Test Artist',
    title: 'Test Album',
    label: 'Test Label',
    catno: 'TEST-123',
    format: 'File',
    genres: ['Electronic'],
    styles: ['Techno'],
    tracks: [track],
    notes: 'Test notes',
    date: new Date('2023-01-01'),
    images: 'https://example.com/image.jpg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a new instance with provided params', () => {
      const csv = new DiscogsCsv(baseParams);

      expect(csv.artist).toBe('Converted Test Artist');
      expect(csv.title).toBe('Test Album');
      expect(csv.genres).toEqual(['Electronic']);
      expect(csv.tracks).toEqual([track]);
    });
  });

  describe('fromRelease', () => {
    it('should create a DiscogsCsv instance from a Release object', () => {
      // Mock the Metadata.fromRelease method directly
      (Metadata.fromRelease as jest.Mock).mockReturnValue({
        toString: () => 'Mocked metadata'
      });

      const csv = DiscogsCsv.fromRelease(release);

      expect(discogsModule.generateSelfReleasedLabel).not.toHaveBeenCalled();
      expect(bandcampModule.keywordsToDiscogsGenres).toHaveBeenCalledWith([
        'electronic',
        'ambient'
      ]);
      expect(bandcampModule.keywordsToDiscogsStyles).toHaveBeenCalledWith([
        'electronic',
        'ambient'
      ]);
      expect(csv).toBeInstanceOf(DiscogsCsv);
      expect(csv.artist).toBe('Converted Test Artist');
      expect(csv.format).toBe('File');
    });

    it('should use self-released label when artist and label are the same', () => {
      // Reset mocks for this test
      jest.clearAllMocks();

      // Mock the Metadata.fromRelease method for this test
      (Metadata.fromRelease as jest.Mock).mockReturnValue({
        toString: () => 'Mocked metadata'
      });

      // Create a new release with same artist and label
      const selfReleasedRelease = new Release(
        'Test Artist',
        'Test Album',
        'Test Artist', // Same as artist name (this is key for this test)
        new Date('2023-01-01'),
        new Date('2023-01-01'),
        [track],
        'https://testartist.bandcamp.com/album/test-album',
        'https://example.com/image.jpg',
        ['electronic', 'ambient'],
        'Test Credit',
        'Test Quality'
      );

      DiscogsCsv.fromRelease(selfReleasedRelease);

      // Just verify the function was called
      expect(discogsModule.generateSelfReleasedLabel).toHaveBeenCalled();
    });
  });

  describe('addGenre', () => {
    it('should add a genre to the genres array', () => {
      const csv = new DiscogsCsv(baseParams);
      csv.addGenre('Pop');

      expect(csv.genres).toEqual(['Electronic', 'Pop']);
    });

    it('should return the instance for chaining', () => {
      const csv = new DiscogsCsv(baseParams);
      const result = csv.addGenre('Pop');

      expect(result).toBe(csv);
    });
  });

  describe('addStyle', () => {
    it('should add a style to the styles array', () => {
      const csv = new DiscogsCsv(baseParams);
      csv.addStyle('House');

      expect(csv.styles).toEqual(['Techno', 'House']);
    });

    it('should return the instance for chaining', () => {
      const csv = new DiscogsCsv(baseParams);
      const result = csv.addStyle('House');

      expect(result).toBe(csv);
    });
  });

  describe('addTrack', () => {
    it('should add a track to the tracks array', () => {
      const csv = new DiscogsCsv(baseParams);
      const newTrack = new Track(2, 'New Track', new TrackTime(0, 4, 15));
      csv.addTrack(newTrack);

      expect(csv.tracks).toEqual([track, newTrack]);
    });

    it('should return the instance for chaining', () => {
      const csv = new DiscogsCsv(baseParams);
      const result = csv.addTrack(track);

      expect(result).toBe(csv);
    });
  });

  describe('getGenre', () => {
    it('should join genres with a comma', () => {
      const csv = new DiscogsCsv({
        ...baseParams,
        genres: ['Electronic', 'Rock', 'Jazz']
      });

      expect(csv.getGenre()).toBe('Electronic, Rock, Jazz');
    });

    it('should filter out "Folk, World, & Country"', () => {
      const csv = new DiscogsCsv({
        ...baseParams,
        genres: ['Electronic', 'Folk, World, & Country', 'Jazz']
      });

      expect(csv.getGenre()).toBe('Electronic, Jazz');
    });
  });

  describe('getStyle', () => {
    it('should join styles with a comma', () => {
      const csv = new DiscogsCsv({
        ...baseParams,
        styles: ['Techno', 'House', 'IDM']
      });

      expect(csv.getStyle()).toBe('Techno, House, IDM');
    });
  });

  describe('getDate', () => {
    it('should call getDiscogsDateValue with the date', () => {
      const csv = new DiscogsCsv(baseParams);
      csv.getDate();

      expect(utilsModule.getDiscogsDateValue).toHaveBeenCalledWith(csv.date);
    });
  });

  describe('toCsvObject', () => {
    it('should return a proper CSV object', () => {
      // Create a fresh instance for this test to ensure no state from other tests affects it
      const freshParams = { ...baseParams };
      const csv = new DiscogsCsv(freshParams);

      // Clear any previous track additions
      csv.tracks = [track];
      csv.genres = ['Electronic'];
      csv.styles = ['Techno'];

      const csvObject = csv.toCsvObject();

      expect(csvObject).toEqual({
        artist: '"Converted Test Artist"',
        title: '"Test Album"',
        label: '"Test Label"',
        catno: 'TEST-123',
        format: 'File',
        genre: '"Electronic"',
        style: '"Techno"',
        tracks: '"Test Track 3:21"',
        notes: '"Test notes"',
        date: '2023-01-01',
        images: 'https://example.com/image.jpg'
      });
    });

    it('should escape double quotes in notes', () => {
      const csv = new DiscogsCsv({
        ...baseParams,
        notes: 'Notes with "quotes" inside'
      });
      const csvObject = csv.toCsvObject();

      expect(csvObject.notes).toBe('"Notes with ""quotes"" inside"');
    });

    it('should format tracks correctly', () => {
      const csv = new DiscogsCsv({
        ...baseParams,
        tracks: [
          new Track(1, 'Track One', new TrackTime(0, 1, 30)),
          new Track(2, 'Track Two', new TrackTime(0, 2, 45))
        ]
      });
      const csvObject = csv.toCsvObject();

      expect(csvObject.tracks).toBe('"Track One 1:30\rTrack Two 2:45"');
    });
  });
});
