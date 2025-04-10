import {
  keywordToDiscogsGenre,
  keywordToDiscogsStyles,
  keywordsToDiscogsGenres,
  keywordsToDiscogsStyles,
  getBandcampSearchAllUrl,
  getBandcampSearchArtistUrl,
  getBandcampSearchReleaseUrl,
  getBandcampSearchReleaseAllUrl
} from './bandcamp';
import { getMapping, Style } from './mapping';

jest.mock('./mapping', () => ({
  getMapping: jest.fn(),
  Style: class {
    constructor(
      public genre: string,
      public style: string
    ) {}
  }
}));

jest.mock('../../config', () => ({
  bandcamp: {
    search: {
      all: 'https://bandcamp.com/search?q={query}',
      artist: 'https://bandcamp.com/search?artist={query}',
      release: 'https://bandcamp.com/search?release={query}'
    }
  }
}));

describe('Bandcamp module', () => {
  beforeEach(() => {
    (getMapping as jest.Mock).mockReturnValue({
      ambient: new Style('Electronic', 'Ambient'),
      'dark ambient': 'ambient',
      electronic: ['ambient', 'synthwave'],
      synthwave: new Style('Electronic', 'Synthwave')
    });
  });

  test('keywordToDiscogsGenre - direct match', () => {
    expect(keywordToDiscogsGenre('ambient')).toEqual(['Electronic']);
  });

  test('keywordToDiscogsGenre - mapped string', () => {
    expect(keywordToDiscogsGenre('dark ambient')).toEqual(['Electronic']);
  });

  test('keywordToDiscogsGenre - mapped array', () => {
    expect(keywordToDiscogsGenre('electronic')).toEqual(['Electronic']);
  });

  test('keywordToDiscogsStyles - direct match', () => {
    expect(keywordToDiscogsStyles('ambient')).toEqual(['Ambient']);
  });

  test('keywordToDiscogsStyles - mapped string', () => {
    expect(keywordToDiscogsStyles('dark ambient')).toEqual(['Ambient']);
  });

  test('keywordToDiscogsStyles - mapped array', () => {
    expect(keywordToDiscogsStyles('electronic')).toEqual([
      'Ambient',
      'Synthwave'
    ]);
  });

  test('keywordsToDiscogsGenres - multiple inputs', () => {
    expect(keywordsToDiscogsGenres(['ambient', 'synthwave'])).toEqual([
      'Electronic'
    ]);
  });

  test('keywordsToDiscogsStyles - multiple inputs', () => {
    expect(keywordsToDiscogsStyles(['ambient', 'synthwave'])).toEqual([
      'Ambient',
      'Synthwave'
    ]);
  });

  test('getBandcampSearchAllUrl', () => {
    expect(getBandcampSearchAllUrl('test artist')).toBe(
      'https://bandcamp.com/search?q=test%20artist'
    );
  });

  test('getBandcampSearchArtistUrl', () => {
    expect(getBandcampSearchArtistUrl('test artist')).toBe(
      'https://bandcamp.com/search?artist=test%20artist'
    );
  });

  test('getBandcampSearchReleaseUrl', () => {
    expect(getBandcampSearchReleaseUrl('test artist', 'test album')).toBe(
      'https://bandcamp.com/search?release=test%20artist%20test%20album'
    );
  });

  test('getBandcampSearchReleaseAllUrl', () => {
    expect(getBandcampSearchReleaseAllUrl('test artist', 'test album')).toBe(
      'https://bandcamp.com/search?q=test%20artist%20test%20album'
    );
  });
});
