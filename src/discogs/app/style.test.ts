import { Style } from './style';
import * as genreModule from '../modules/genres';

describe('Style', () => {
  it('should return the correct genre for a known style', () => {
    jest.spyOn(genreModule, 'getGenreByStyle').mockReturnValue('Electronic');

    const style = new Style('ambient');
    expect(style.genre).toBe('Electronic');
  });

  it('should return an empty string for an unknown style', () => {
    jest.spyOn(genreModule, 'getGenreByStyle').mockReturnValue(null);

    const style = new Style('unknown style');
    expect(style.genre).toBe('');
  });
});
