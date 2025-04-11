import { Style } from '../app/style';
import { GenreLookup } from '../modules/genreLookup';

// Mock the GenreLookup
jest.mock('../modules/genreLookup', () => ({
  GenreLookup: {
    getByStyle: jest.fn()
  }
}));

describe('Style', () => {
  it('should resolve the genre on creation when a matching style is provided', () => {
    // Mock GenreLookup to return a genre for a style
    (GenreLookup.getByStyle as jest.Mock).mockReturnValue('Electronic');

    const style = new Style('ambient');

    expect(style.genre).toBe('Electronic');
    expect(GenreLookup.getByStyle).toHaveBeenCalledWith('ambient');
  });

  it('should resolve the genre as an empty string if no matching genre is found', () => {
    // Mock GenreLookup to return null when no genre is found
    (GenreLookup.getByStyle as jest.Mock).mockReturnValue(null);

    const style = new Style('unknown');

    // Check that the genre is empty
    expect(style.genre).toBe('');
    expect(GenreLookup.getByStyle).toHaveBeenCalledWith('unknown');
  });
});
