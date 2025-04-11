import { getKeywordMapping, Style } from './keywordMapping';
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

describe('getKeywordMapping', () => {
  it('should return a populated mapping', async () => {
    const result = getKeywordMapping();

    expect(result).toHaveProperty('dark ambient');
    expect(result).toHaveProperty('black metal');
    expect(result).toHaveProperty('martial');
    expect(result).toHaveProperty('martial industrial');
    expect(result['dark ambient']).toBeInstanceOf(Style);
    expect(result['black metal']).toBeInstanceOf(Style);
    expect(result['martial']).toBeInstanceOf(Style);
    expect(result['martial industrial']).toBeInstanceOf(Array);
  });
});
