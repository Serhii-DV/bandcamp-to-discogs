import { transliterate } from './transliterate';

describe('transliterate', () => {
  it('should transliterate a single Cyrillic letter', () => {
    expect(transliterate('А')).toBe('A');
    expect(transliterate('я')).toBe('ya');
    expect(transliterate('Щ')).toBe('SCH');
  });

  it('should transliterate a word', () => {
    expect(transliterate('Привет')).toBe('Privet');
    expect(transliterate('Сумы')).toBe('Sumi');
    expect(transliterate('Борщ')).toBe('Borsch');
  });

  it('should transliterate a sentence while keeping spaces and punctuation', () => {
    expect(transliterate('Привет, мир!')).toBe('Privet, mir!');
    expect(transliterate('Как дела?')).toBe('Kak dela?');
  });

  it('should handle mixed Latin and Cyrillic text', () => {
    expect(transliterate('Cyrillic и Latin')).toBe('Cyrillic i Latin');
  });

  it('should return the same input if it has no Cyrillic characters', () => {
    expect(transliterate('Hello World!')).toBe('Hello World!');
    expect(transliterate('1234567890')).toBe('1234567890');
  });

  it('should correctly handle edge cases', () => {
    expect(transliterate('')).toBe('');
    expect(transliterate(' ')).toBe(' ');
    expect(transliterate('Ёжик')).toBe('YOzhik');
  });
});
