import {
  camelCaseToReadable,
  capitalizeEachWord,
  containsOneOf,
  convertBreaksToNewlines,
  convertNewlinesToBreaks,
  convertToAlias,
  getTextInitials,
  normalizeRomanNumerals,
  normalizeSpaces,
  removeBrackets,
  removeInvisibleChars,
  removeLeadingZeroOrColon,
  removeYearInBrackets,
  safeFilename,
  splitString,
  trimCharactersFromString,
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

describe('trimCharactersFromString', () => {
  it('should trim the specified characters from both ends of the string', () => {
    expect(trimCharactersFromString('$$$hello$$$', '$')).toBe('hello');
    expect(trimCharactersFromString('###test###', '#')).toBe('test');
  });

  it('should handle strings with no characters to trim', () => {
    expect(trimCharactersFromString('hello', '$')).toBe('hello');
    expect(trimCharactersFromString('test', '#')).toBe('test');
  });

  it('should trim multiple characters', () => {
    expect(trimCharactersFromString('!!@hello@!!', '@!')).toBe('hello');
  });

  it('should remove all characters from both ends if they are in the trim set', () => {
    expect(trimCharactersFromString('***', '*')).toBe('');
    expect(trimCharactersFromString('!!!', '!')).toBe('');
  });

  it('should return an empty string when the input string is empty', () => {
    expect(trimCharactersFromString('', '$')).toBe('');
  });

  it('should handle trimming special characters', () => {
    expect(trimCharactersFromString('...hello...', '.')).toBe('hello');
    expect(trimCharactersFromString('(!)important(!)', '()!')).toBe(
      'important'
    );
  });

  it('should return the original string if no matching characters are at the ends', () => {
    expect(trimCharactersFromString('no-trim-here', '#')).toBe('no-trim-here');
  });

  it('should work with strings containing spaces', () => {
    expect(trimCharactersFromString('   hello world   ', ' ')).toBe(
      'hello world'
    );
  });

  it('should correctly handle empty input and trim characters to remove', () => {
    expect(trimCharactersFromString('   ', ' ')).toBe('');
    expect(trimCharactersFromString('   hello   ', ' ')).toBe('hello');
  });

  it('should correctly escape special characters in the trim string', () => {
    expect(trimCharactersFromString('$$$abc$$$', '$')).toBe('abc');
    expect(trimCharactersFromString('[abc]', '[]')).toBe('abc');
  });
});

describe('removeInvisibleChars', () => {
  it('should remove zero-width space character (U+200B)', () => {
    expect(removeInvisibleChars('Hello\u200BWorld')).toBe('HelloWorld');
  });

  it('should remove zero-width non-joiner character (U+200C)', () => {
    expect(removeInvisibleChars('Hello\u200CWorld')).toBe('HelloWorld');
  });

  it('should remove left-to-right mark (U+200E)', () => {
    expect(removeInvisibleChars('Hello\u200EWorld')).toBe('HelloWorld');
  });

  it('should remove right-to-left mark (U+200F)', () => {
    expect(removeInvisibleChars('Hello\u200FWorld')).toBe('HelloWorld');
  });

  it('should remove invisible characters from the middle of a string', () => {
    expect(removeInvisibleChars('Hel\u200Blo\u200FWorld')).toBe('HelloWorld');
  });

  it('should remove invisible characters from the beginning and end of a string', () => {
    expect(removeInvisibleChars('\u200BHello World\u200F')).toBe('Hello World');
  });

  it('should not remove visible characters', () => {
    expect(removeInvisibleChars('Hello World')).toBe('Hello World');
  });

  it('should handle strings with multiple invisible characters', () => {
    expect(removeInvisibleChars('H\u200Bello\u200C World\u200F')).toBe(
      'Hello World'
    );
  });

  it('should handle an empty string correctly', () => {
    expect(removeInvisibleChars('')).toBe('');
  });

  it('should return the same string if no invisible characters are present', () => {
    expect(removeInvisibleChars('Invisible characters should not exist')).toBe(
      'Invisible characters should not exist'
    );
  });

  it('should handle invisible HTML entities like &lrm;', () => {
    expect(removeInvisibleChars('Hello&lrm;World')).toBe('HelloWorld');
  });

  it('should remove all invisible characters and HTML entities', () => {
    expect(removeInvisibleChars('\u200BHello&lrm; World\u200F')).toBe(
      'Hello World'
    );
  });
});

describe('removeLeadingZeroOrColon', () => {
  it('should remove leading zeros from the string', () => {
    expect(removeLeadingZeroOrColon('000123')).toBe('123');
    expect(removeLeadingZeroOrColon('00123')).toBe('123');
  });

  it('should remove leading colons from the string', () => {
    expect(removeLeadingZeroOrColon(':123')).toBe('123');
    expect(removeLeadingZeroOrColon('::123')).toBe('123');
  });

  it('should remove both leading zeros and colons', () => {
    expect(removeLeadingZeroOrColon(':000123')).toBe('123');
    expect(removeLeadingZeroOrColon('::000123')).toBe('123');
  });

  it('should return the same string if no leading zero or colon exists', () => {
    expect(removeLeadingZeroOrColon('123')).toBe('123');
    expect(removeLeadingZeroOrColon('abc')).toBe('abc');
  });

  it('should return an empty string if the string consists entirely of zeros or colons', () => {
    expect(removeLeadingZeroOrColon('0000')).toBe('');
    expect(removeLeadingZeroOrColon('::::')).toBe('');
    expect(removeLeadingZeroOrColon('::00')).toBe('');
  });

  it('should handle an empty string correctly', () => {
    expect(removeLeadingZeroOrColon('')).toBe('');
  });

  it('should handle strings with mixed content, removing only the leading zeros or colons', () => {
    expect(removeLeadingZeroOrColon('::0abc')).toBe('abc');
    expect(removeLeadingZeroOrColon('000:xyz')).toBe('xyz');
  });

  it('should handle time values', () => {
    expect(removeLeadingZeroOrColon('00:00:01')).toBe('1');
    expect(removeLeadingZeroOrColon('00:00:12')).toBe('12');
    expect(removeLeadingZeroOrColon('00:01:23')).toBe('1:23');
    expect(removeLeadingZeroOrColon('00:12:34')).toBe('12:34');
    expect(removeLeadingZeroOrColon('01:23:45')).toBe('1:23:45');
    expect(removeLeadingZeroOrColon('12:34:56')).toBe('12:34:56');
  });
});

describe('camelCaseToReadable', () => {
  it('should convert camelCase to readable format', () => {
    expect(camelCaseToReadable('camelCase')).toBe('Camel Case');
    expect(camelCaseToReadable('helloWorld')).toBe('Hello World');
    expect(camelCaseToReadable('myVariableName')).toBe('My Variable Name');
  });

  it('should handle single word in camelCase', () => {
    expect(camelCaseToReadable('word')).toBe('Word');
  });

  it('should handle strings that are already in readable format', () => {
    expect(camelCaseToReadable('HelloWorld')).toBe('Hello World');
  });

  it('should return an empty string if the input is empty', () => {
    expect(camelCaseToReadable('')).toBe('');
  });
});

describe('convertNewlinesToBreaks', () => {
  it('should convert newline characters to <br> tags', () => {
    const input = 'Hello\nWorld';
    const expected = 'Hello<br>World';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });

  it('should handle multiple newline characters', () => {
    const input = 'Hello\nWorld\nGoodbye';
    const expected = 'Hello<br>World<br>Goodbye';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });

  it('should remove carriage return characters', () => {
    const input = 'Hello\rWorld';
    const expected = 'Hello<br>World';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });

  it('should convert multiple newlines and remove carriage returns', () => {
    const input = 'Hello\r\nWorld\rGoodbye';
    const expected = 'Hello<br>World<br>Goodbye';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });

  it('should handle strings without newlines or carriage returns', () => {
    const input = 'Hello World';
    const expected = 'Hello World';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });

  it('should handle empty strings', () => {
    expect(convertNewlinesToBreaks('')).toBe('');
  });

  it('should handle only carriage return characters', () => {
    const input = 'Hello\r\rWorld';
    const expected = 'Hello<br><br>World';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });

  it('should handle strings with mixed newlines and carriage returns', () => {
    const input = 'Hello\rWorld\nGoodbye';
    const expected = 'Hello<br>World<br>Goodbye';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });

  it('should convert newline to <br> even with leading or trailing spaces', () => {
    const input = '  Hello \n World  ';
    const expected = '  Hello <br> World  ';
    expect(convertNewlinesToBreaks(input)).toBe(expected);
  });
});

describe('convertBreaksToNewlines', () => {
  it('replaces <br> with newlines', () => {
    const input = 'Line 1<br>Line 2';
    const output = 'Line 1\nLine 2';
    expect(convertBreaksToNewlines(input)).toBe(output);
  });

  it('replaces <br/> and <br /> with newlines (self-closing tags)', () => {
    const input = 'Line 1<br/>Line 2<br />Line 3';
    const output = 'Line 1\nLine 2\nLine 3';
    expect(convertBreaksToNewlines(input)).toBe(output);
  });

  it('handles uppercase tags', () => {
    const input = 'Line 1<BR>Line 2<BR/>Line 3<Br />';
    const output = 'Line 1\nLine 2\nLine 3';
    expect(convertBreaksToNewlines(input)).toBe(output);
  });

  it('removes carriage returns', () => {
    const input = 'Line 1\r\nLine 2\rLine 3';
    const output = 'Line 1\nLine 2Line 3';
    expect(convertBreaksToNewlines(input)).toBe(output);
  });

  it('trims leading and trailing whitespace', () => {
    const input = '  Line 1<br>Line 2  ';
    const output = 'Line 1\nLine 2';
    expect(convertBreaksToNewlines(input)).toBe(output);
  });

  it('returns empty string for input with only whitespace and breaks', () => {
    const input = '  <br>  \r<br /> ';
    const output = '';
    expect(convertBreaksToNewlines(input)).toBe(output);
  });

  it('returns the same string if no <br> or \r is present', () => {
    const input = 'Just a regular string.';
    expect(convertBreaksToNewlines(input)).toBe(input);
  });
});

describe('safeFilename', () => {
  it('should replace spaces with underscores', () => {
    expect(safeFilename('My File Name')).toBe('my_file_name');
  });

  it('should remove RU accents and transliterate characters', () => {
    expect(safeFilename('Привет Мир')).toBe('privet_mir');
  });

  it('should convert the result to lowercase', () => {
    expect(safeFilename('UpperCaseText')).toBe('uppercasetext');
    expect(safeFilename('MiXeD CaSe')).toBe('mixed_case');
  });

  it('should handle empty strings', () => {
    expect(safeFilename('')).toBe('');
  });

  it('should handle strings with only special characters', () => {
    expect(safeFilename('!@#$%^&*()')).toBe('__________');
  });

  it('should not add extra underscores for consecutive non-alphanumeric characters', () => {
    expect(safeFilename('Hello---World')).toBe('hello___world');
  });
});

describe('removeYearInBrackets', () => {
  it('should remove year values in brackets from the string and normalize spaces', () => {
    expect(removeYearInBrackets('Album Title (2023)')).toBe('Album Title');
    expect(removeYearInBrackets("Movie (2020) - Director's Cut")).toBe(
      "Movie - Director's Cut"
    );
  });

  it('should remove multiple year values in brackets and normalize spaces', () => {
    expect(
      removeYearInBrackets('First Album (2005)  and Second Album (2010)')
    ).toBe('First Album and Second Album');
  });

  it('should only remove exact 4-digit years in brackets', () => {
    expect(removeYearInBrackets('Album (123)')).toBe('Album (123)');
    expect(removeYearInBrackets('Album (12345)')).toBe('Album (12345)');
  });

  it('should handle strings without year values in brackets', () => {
    expect(removeYearInBrackets('Album Title')).toBe('Album Title');
  });

  it('should handle empty strings', () => {
    expect(removeYearInBrackets('')).toBe('');
  });

  it('should handle strings with only year values in brackets', () => {
    expect(removeYearInBrackets('(2023)')).toBe('');
  });

  it('should handle multiple spaces created after removing years', () => {
    expect(removeYearInBrackets('Before (2020)  After')).toBe('Before After');
    expect(removeYearInBrackets('Text (2020)   with    many spaces')).toBe(
      'Text with many spaces'
    );
  });
});

describe('normalizeSpaces', () => {
  it('should replace multiple spaces with a single space', () => {
    expect(normalizeSpaces('Hello  World')).toBe('Hello World');
    expect(normalizeSpaces('Too    many      spaces')).toBe('Too many spaces');
  });

  it('should handle strings with no extra spaces', () => {
    expect(normalizeSpaces('No extra spaces')).toBe('No extra spaces');
  });

  it('should handle strings with leading and trailing spaces', () => {
    expect(normalizeSpaces('  Start and end  ')).toBe(' Start and end ');
  });

  it('should handle empty strings', () => {
    expect(normalizeSpaces('')).toBe('');
  });

  it('should handle strings with only spaces', () => {
    expect(normalizeSpaces('   ')).toBe(' ');
  });
});

describe('normalizeRomanNumerals', () => {
  it('should convert mixed-case Roman numerals to uppercase', () => {
    expect(normalizeRomanNumerals('i')).toBe('I');
    expect(normalizeRomanNumerals('Ii')).toBe('II');
    expect(normalizeRomanNumerals('iii')).toBe('III');
    expect(normalizeRomanNumerals('Iv')).toBe('IV');
    expect(normalizeRomanNumerals('Vi')).toBe('VI');
    expect(normalizeRomanNumerals('xii')).toBe('XII');
  });

  it('should handle Roman numerals within text', () => {
    expect(normalizeRomanNumerals('Chapter iv: The Beginning')).toBe(
      'Chapter IV: The Beginning'
    );
    expect(normalizeRomanNumerals('World War ii ended in 1945')).toBe(
      'World War II ended in 1945'
    );
    expect(
      normalizeRomanNumerals('Star Wars Episode vi: Return of the Jedi')
    ).toBe('Star Wars Episode VI: Return of the Jedi');
  });

  it('should normalize multiple Roman numerals in text', () => {
    expect(normalizeRomanNumerals('i, ii, and iii are Roman numerals')).toBe(
      'I, II, and III are Roman numerals'
    );
    expect(
      normalizeRomanNumerals('Sections iv through viii cover advanced topics')
    ).toBe('Sections IV through VIII cover advanced topics');
  });

  it('should not modify non-Roman numerals', () => {
    expect(normalizeRomanNumerals('hello world')).toBe('hello world');
    expect(normalizeRomanNumerals('123 abc')).toBe('123 abc');
  });

  it('should handle empty strings', () => {
    expect(normalizeRomanNumerals('')).toBe('');
  });

  it('should not modify words that happen to contain Roman numeral letters', () => {
    expect(normalizeRomanNumerals('mix')).toBe('mix'); // 'mix' contains 'ix' but isn't a Roman numeral in context
    expect(normalizeRomanNumerals('civic')).toBe('civic'); // 'civic' contains 'iv' but isn't a Roman numeral
  });

  it('should handle strings with punctuation around Roman numerals', () => {
    expect(normalizeRomanNumerals('(iv)')).toBe('(IV)');
    expect(normalizeRomanNumerals('"vi"')).toBe('"VI"');
    expect(normalizeRomanNumerals('ix.')).toBe('IX.');
  });

  it('should correctly identify isolated Roman numerals', () => {
    expect(normalizeRomanNumerals('i ii iii iv v vi vii viii ix x')).toBe(
      'I II III IV V VI VII VIII IX X'
    );
    expect(
      normalizeRomanNumerals('xi xii xiii xiv xv xvi xvii xviii xix xx')
    ).toBe('XI XII XIII XIV XV XVI XVII XVIII XIX XX');
  });
});
