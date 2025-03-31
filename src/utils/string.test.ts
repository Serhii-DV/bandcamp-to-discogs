import { getTextInitials, truncateText } from './string';

describe('getTextInitials', () => {
  it('should return initials for multiple words', () => {
    expect(getTextInitials('cryo chamber')).toBe('CC');
    expect(getTextInitials('hello world')).toBe('HW');
    expect(getTextInitials('hello world again')).toBe('HWA');
  });

  it('should return a single uppercase letter for a single word', () => {
    expect(getTextInitials('metallica')).toBe('M');
    expect(getTextInitials('javascript')).toBe('J');
  });

  it('should handle extra spaces correctly', () => {
    expect(getTextInitials('  spaced  out  ')).toBe('SO');
  });

  it('should return an empty string for an empty input', () => {
    expect(getTextInitials('')).toBe('');
  });

  it('should handle strings with only spaces', () => {
    expect(getTextInitials('   ')).toBe('');
  });
});

describe('truncateText', () => {
  it("should truncate text and add '...'", () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });

  it('should return the text unchanged if it is shorter than the length', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should allow a custom truncation ending', () => {
    expect(truncateText('Hello World', 5, '***')).toBe('Hello***');
  });

  it('should return an empty string if the text is empty', () => {
    expect(truncateText('', 5)).toBe('');
  });

  it('should handle edge cases with length 0', () => {
    expect(truncateText('Hello', 0)).toBe('...');
  });

  it('should not truncate if length equals text length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });
});
