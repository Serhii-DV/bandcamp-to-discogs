import { getMapping, loadKeywordMapping, Style } from './mapping';
import { getGenreByStyle } from '../../discogs/modules/genres';
import { jest } from '@jest/globals';

// Mock the `getGenreByStyle` function
jest.mock('../../discogs/modules/genres', () => ({
  getGenreByStyle: jest.fn()
}));

describe('Style class', () => {
  it('should initialize with a style value', () => {
    const style = new Style('Rock');
    expect(style.style).toBe('Rock');
  });

  it('should return the correct genre using getGenreByStyle', () => {
    (getGenreByStyle as jest.Mock).mockReturnValue('Alternative');
    const style = new Style('Indie Rock');
    expect(style.genre).toBe('Alternative');
    expect(getGenreByStyle).toHaveBeenCalledWith('Indie Rock');
  });
});

describe('getMapping', () => {
  it('should return an empty object initially', () => {
    expect(getMapping()).toEqual({});
  });

  it('should return a populated mapping after loading keywords', async () => {
    // Mock a sample keyword mapping
    const mockKeywordMapping = {
      Rock: 'Rock',
      Pop: 'Pop',
      Jazz: 'Jazz'
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockKeywordMapping)
      })
    ) as jest.Mock;

    await loadKeywordMapping('http://example.com/keywords.json');
    const result = getMapping();

    expect(result).toHaveProperty('Rock');
    expect(result).toHaveProperty('Pop');
    expect(result).toHaveProperty('Jazz');
    expect(result['Rock']).toBeInstanceOf(Style);
    expect(result['Pop']).toBeInstanceOf(Style);
    expect(result['Jazz']).toBeInstanceOf(Style);
  });
});
