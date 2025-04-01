import { convertArtistName } from './submission';

describe('convertArtistName', () => {
  test("should return 'Various' for 'VVAA'", () => {
    expect(convertArtistName('VVAA')).toBe('Various');
  });

  test("should return 'Various' for 'Various Artist'", () => {
    expect(convertArtistName('Various Artist')).toBe('Various');
  });

  test("should return 'Various' for 'Various Artists'", () => {
    expect(convertArtistName('Various Artists')).toBe('Various');
  });

  test('should return the original artist name if not in various artists list', () => {
    expect(convertArtistName('Test Artist')).toBe('Test Artist');
  });

  test("should be case-sensitive and not convert lowercase 'various artist'", () => {
    expect(convertArtistName('various artist')).toBe('various artist');
  });
});
