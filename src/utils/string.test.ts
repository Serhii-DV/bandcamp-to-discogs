import {
  capitalizeEachWord,
  containsOneOf,
  convertToAlias,
  getTextInitials,
  removeBrackets,
  splitString,
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

describe('splitString', () => {
  it('should split a string by a single delimiter', () => {
    expect(splitString('apple,banana,orange', ',')).toEqual([
      'apple',
      'banana',
      'orange'
    ]);
  });

  it('should split a string by multiple delimiters', () => {
    expect(splitString('apple, banana; orange', /[,\s;]/)).toEqual([
      'apple',
      'banana',
      'orange'
    ]);
  });

  it('should trim whitespace from substrings', () => {
    expect(splitString('  apple  ,   banana  , orange  ', ',')).toEqual([
      'apple',
      'banana',
      'orange'
    ]);
  });

  it('should remove empty entries after splitting', () => {
    expect(splitString('apple,,banana,,orange', ',')).toEqual([
      'apple',
      'banana',
      'orange'
    ]);
  });

  it('should handle multiple consecutive delimiters correctly', () => {
    expect(splitString('apple,,banana,,,orange', ',')).toEqual([
      'apple',
      'banana',
      'orange'
    ]);
  });

  it('should handle empty string', () => {
    expect(splitString('', ',')).toEqual([]);
  });

  it('should return an empty array when no non-empty substrings remain', () => {
    expect(splitString('  , , ,  ', ',')).toEqual([]);
  });

  it('should split by a regex with special characters', () => {
    expect(splitString('apple!banana!orange', /[!]/)).toEqual([
      'apple',
      'banana',
      'orange'
    ]);
  });

  it('should handle strings with only delimiters', () => {
    expect(splitString(',,,,', ',')).toEqual([]);
  });

  it('should return a single item if there is no delimiter', () => {
    expect(splitString('apple', ',')).toEqual(['apple']);
  });

  it('should handle complex delimiters (spaces, commas, semicolons, etc.)', () => {
    expect(splitString('apple banana,orange ;grape', /[\s,;]+/)).toEqual([
      'apple',
      'banana',
      'orange',
      'grape'
    ]);
  });

  it('should handle multiple delimiters with spaces correctly', () => {
    expect(splitString('apple, banana ; orange  ', /[\s,;]+/)).toEqual([
      'apple',
      'banana',
      'orange'
    ]);
  });
});

describe('containsOneOf', () => {
  it('should return true if string1 contains any string from the array', () => {
    expect(containsOneOf('apple pie', ['apple', 'banana', 'orange'])).toBe(
      true
    );
    expect(containsOneOf('Hello world!', ['world', 'earth'])).toBe(true);
  });

  it('should return false if string1 contains none of the strings from the array', () => {
    expect(containsOneOf('apple pie', ['banana', 'orange', 'grape'])).toBe(
      false
    );
    expect(containsOneOf('Hello world!', ['earth', 'mars'])).toBe(false);
    expect(containsOneOf('apple', ['', 'banana'])).toBe(false);
  });

  it('should return true if string1 contains a string from the array with case insensitivity', () => {
    expect(containsOneOf('Apple Pie', ['apple', 'banana', 'orange'])).toBe(
      true
    );
    expect(containsOneOf('HELLO world!', ['world', 'earth'])).toBe(true);
  });

  it('should return false if the array is empty', () => {
    expect(containsOneOf('apple pie', [])).toBe(false);
  });

  it('should return true if string1 matches exactly with a string in the array', () => {
    expect(containsOneOf('apple', ['apple', 'banana', 'orange'])).toBe(true);
    expect(containsOneOf('hello', ['hello', 'world'])).toBe(true);
  });

  it('should return false for empty strings', () => {
    expect(containsOneOf('', ['apple', 'banana'])).toBe(false);
  });

  it('should return true if string1 contains a partial match from the array', () => {
    expect(containsOneOf('I love apple pie', ['apple', 'banana'])).toBe(true);
    expect(containsOneOf('I like banana bread', ['apple', 'banana'])).toBe(
      true
    );
  });

  it('should handle large arrays efficiently', () => {
    const largeArray = Array(1000).fill('apple');
    expect(containsOneOf('I like apple pie', largeArray)).toBe(true);
    expect(containsOneOf('I like banana pie', largeArray)).toBe(false);
  });
});

describe('removeBrackets', () => {
  it('should remove the first occurrence of brackets and its contents', () => {
    expect(removeBrackets('Hello (world)!')).toBe('Hello!');
    expect(removeBrackets('Apple (fruit), Banana')).toBe('Apple, Banana');
  });

  it('should handle strings without brackets', () => {
    expect(removeBrackets('No brackets here')).toBe('No brackets here');
  });

  it('should handle strings with multiple sets of brackets, removing only the first one', () => {
    expect(removeBrackets('Hello (world)! I am (here).')).toBe(
      'Hello! I am (here).'
    );
  });

  it('should handle empty strings', () => {
    expect(removeBrackets('')).toBe('');
  });

  it('should remove empty brackets', () => {
    expect(removeBrackets('Hello () world')).toBe('Hello world');
  });

  it('should remove brackets with spaces and no content', () => {
    expect(removeBrackets('Test ( ) here')).toBe('Test here');
  });

  it('should handle strings with only brackets', () => {
    expect(removeBrackets('()')).toBe('');
    expect(removeBrackets('(content)')).toBe('');
  });
});
