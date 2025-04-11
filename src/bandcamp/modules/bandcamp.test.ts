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

jest.mock('../../config', () => ({
  bandcamp: {
    search: {
      all: 'https://bandcamp.com/search?q={query}',
      artist: 'https://bandcamp.com/search?artist={query}',
      release: 'https://bandcamp.com/search?release={query}'
    }
  }
}));

describe('keywordToDiscogsGenre', () => {
  const genreTests = [
    {
      input: 'ambient',
      expected: ['Electronic']
    },
    {
      input: 'dark ambient',
      expected: ['Electronic']
    },
    {
      input: 'neoclassical',
      expected: ['Classical']
    },
    {
      input: 'ambient drone',
      expected: ['Electronic']
    },
    {
      input: 'bombastic',
      expected: ['Brass & Military', 'Electronic', 'Classical']
    },
    {
      input: 'martial industrial ambient',
      expected: ['Brass & Military', 'Electronic']
    },
    {
      input: 'martial folk',
      expected: ['Brass & Military', 'Electronic']
    },
    {
      input: 'black metal',
      expected: ['Rock']
    },
    // Aliases
    {
      input: 'darkambient',
      expected: ['Electronic']
    }
  ];

  genreTests.forEach(({ input, expected }) => {
    test(`keywordToDiscogsGenre: ${input}`, () => {
      expect(keywordToDiscogsGenre(input)).toEqual(expected);
    });
  });
});

describe('keywordToDiscogsStyles', () => {
  const styleTests = [
    {
      input: 'ambient',
      expected: ['Ambient']
    },
    {
      input: 'drone',
      expected: ['Drone']
    },
    {
      input: 'dark ambient',
      expected: ['Dark Ambient']
    },
    {
      input: 'darkwave',
      expected: ['Darkwave']
    },
    {
      input: 'folk',
      expected: ['Folk']
    },
    {
      input: 'black metal',
      expected: ['Black Metal']
    }
  ];

  styleTests.forEach(({ input, expected }) => {
    test(`keywordToDiscogsStyles: ${input}`, () => {
      expect(keywordToDiscogsStyles(input)).toEqual(expected);
    });
  });
});

describe('keywordsToDiscogsGenres', () => {
  const multipleGenreTests = [
    {
      input: ['ambient', 'synthwave'],
      expected: ['Electronic']
    }
  ];

  multipleGenreTests.forEach(({ input, expected }) => {
    test(`keywordsToDiscogsGenres: ${input.join(', ')}`, () => {
      expect(keywordsToDiscogsGenres(input)).toEqual(expected);
    });
  });
});

describe('keywordsToDiscogsStyles', () => {
  const multipleStyleTests = [
    {
      input: ['ambient', 'synthwave'],
      expected: ['Ambient']
    }
  ];

  multipleStyleTests.forEach(({ input, expected }) => {
    test(`keywordsToDiscogsStyles: ${input.join(', ')}`, () => {
      expect(keywordsToDiscogsStyles(input)).toEqual(expected);
    });
  });
});

describe('Bandcamp module', () => {
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
