import { GenreLookup } from '../modules/genreLookup';

describe('GenreLookup', () => {
  it('should return the genre if style is found', () => {
    const style = 'Dark Ambient';
    const genre = GenreLookup.getByStyle(style);
    expect(genre).toBe('Electronic');
  });

  it('should return null if no genre matches the style', () => {
    const style = 'nonexistent';
    const genre = GenreLookup.getByStyle(style);
    expect(genre).toBeNull();
  });
});
