import {
  capitalizeEachWord,
  convertToAlias,
  getTextInitials,
  truncateText
} from './string';

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

describe('capitalizeEachWord', () => {
  it('should capitalize each word in a sentence', () => {
    expect(capitalizeEachWord('hello world')).toBe('Hello World');
    expect(capitalizeEachWord('javascript is fun')).toBe('Javascript Is Fun');
  });

  it('should handle mixed-case input', () => {
    expect(capitalizeEachWord('hElLo WoRLd')).toBe('Hello World');
  });

  it('should preserve spaces and punctuation', () => {
    expect(capitalizeEachWord('hello, world!')).toBe('Hello, World!');
    expect(capitalizeEachWord("it's a test.")).toBe("It's A Test.");
    expect(capitalizeEachWord('he said: "hello there"')).toBe(
      'He Said: "Hello There"'
    );
  });

  it('should handle multiple spaces between words', () => {
    expect(capitalizeEachWord('hello   world')).toBe('Hello   World');
  });

  it('should handle special characters correctly', () => {
    expect(capitalizeEachWord('(hello) world!')).toBe('(Hello) World!');
    expect(capitalizeEachWord('good-morning everyone')).toBe(
      'Good-Morning Everyone'
    );
  });

  it('should return an empty string if input is empty', () => {
    expect(capitalizeEachWord('')).toBe('');
  });

  it('should not modify already capitalized words', () => {
    expect(capitalizeEachWord('Hello World')).toBe('Hello World');
  });

  it('should handle single-letter words', () => {
    expect(capitalizeEachWord('a b c')).toBe('A B C');
  });
});

describe('convertToAlias', () => {
  it('should convert a string to a slug', () => {
    expect(convertToAlias('Hello World')).toBe('hello-world');
    expect(convertToAlias('JavaScript is fun!')).toBe('javascript-is-fun');
  });

  it('should handle special characters', () => {
    expect(convertToAlias('Hello, World!')).toBe('hello-world');
    expect(convertToAlias('C++ is great!!')).toBe('c-is-great');
  });

  it('should convert spaces to hyphens', () => {
    expect(convertToAlias('This is a test')).toBe('this-is-a-test');
    expect(convertToAlias('Convert to alias')).toBe('convert-to-alias');
  });

  it('should remove leading and trailing non-alphanumeric characters', () => {
    expect(convertToAlias('  Hello World  ')).toBe('hello-world');
    expect(convertToAlias('!!!Special characters!!')).toBe(
      'special-characters'
    );
  });

  it('should handle numbers correctly', () => {
    expect(convertToAlias('Product 123 - Available!')).toBe(
      'product-123-available'
    );
    expect(convertToAlias('Version 2.0.1')).toBe('version-2-0-1');
  });

  it('should handle empty string', () => {
    expect(convertToAlias('')).toBe('');
  });

  it('should handle strings with only non-alphanumeric characters', () => {
    expect(convertToAlias('!!!')).toBe('');
    expect(convertToAlias('???????')).toBe('');
  });

  it('should handle mixed case input correctly', () => {
    expect(convertToAlias('CamelCase Example')).toBe('camelcase-example');
    expect(convertToAlias('Title Case Test')).toBe('title-case-test');
  });
});
