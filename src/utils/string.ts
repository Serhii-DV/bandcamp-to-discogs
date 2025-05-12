import { transliterate } from './transliterate';

/**
 * Extracts the initials from the text, with each initial in uppercase.
 * For single-word text, it returns the first letter in uppercase.
 *
 * Examples:
 * getTextInitials("cryo chamber") => "CC"
 * getTextInitials("metallica") => "M"
 */
export function getTextInitials(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Truncates the text to the specified length and adds '...' at the end.
 * If the text is shorter than or equal to the specified length, it returns the text unchanged.
 *
 * Examples:
 * truncateText("Hello World", 5) => "Hello..."
 * truncateText("Hello", 10) => "Hello"
 */
export function truncateText(
  text: string,
  length: number,
  end: string = '...'
): string {
  return text.length <= length ? text : text.slice(0, length) + end;
}

export function capitalizeEachWord(str: string): string {
  return str
    .split(/(\s+|[^a-zA-Z0-9'\-]+)/g) // Split by spaces and non-alphanumeric characters, keeping separators
    .map(
      (word) =>
        /^[a-zA-Z]/.test(word) // Check if the word starts with a letter
          ? word
              .split('-') // Split hyphenated words
              .map(
                (part) =>
                  part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
              ) // Capitalize each part of the hyphenated word
              .join('-') // Join them back with the hyphen
          : word // Leave separators and non-alphabetic parts as they are
    )
    .join('');
}

export function convertToAlias(str: string): string {
  const slug = str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const trimmedSlug = slug.replace(/^-+|-+$/g, '');
  return trimmedSlug;
}

/**
 * Splits a string into an array of substrings using specified delimiters, trims whitespace, and removes empty entries.
 *
 * @param inputString - The string to be split.
 * @param delimiters - A regular expression or string specifying the delimiter(s) to use for splitting.
 * @returns An array of non-empty, trimmed substrings resulting from the split operation.
 */
export function splitString(
  inputString: string,
  delimiters: RegExp | string
): string[] {
  const resultArray = inputString.split(delimiters);
  return resultArray
    .map((item: string) => item.trim())
    .filter((item: string) => item !== '');
}

/**
 * Checks if a string contains any of the strings in a given array.
 * @param string1 - The string to check.
 * @param arrayOfStrings - An array of strings to look for.
 * @returns True if `string1` contains any of the strings in `arrayOfStrings`; otherwise, false.
 */
export function containsOneOf(
  string1: string,
  arrayOfStrings: string[]
): boolean {
  // Return false immediately if string1 is empty
  if (string1 === '') return false;
  const lcString = string1.toLowerCase();

  // Check each string in the array, converted to lowercase for case-insensitive comparison
  for (const string2 of arrayOfStrings) {
    if (string2 === '') continue;
    if (lcString.includes(string2.toLowerCase())) {
      return true;
    }
  }
  return false;
}

export function removeBrackets(inputString: string): string {
  return inputString.replace(/\s*\([^)]*\)/, '');
}

export function trimCharactersFromString(
  inputString: string,
  charactersToTrim: string
): string {
  // Escape special characters within the provided string and construct the regex pattern
  const escapedCharacters = charactersToTrim.replace(
    /[-/\\^$*+?.()|[\]{}]/g,
    '\\$&'
  );
  const regexPattern = new RegExp(
    `^[${escapedCharacters}]+|[${escapedCharacters}]+$`,
    'g'
  );
  const trimmedString = inputString.replace(regexPattern, '');

  return trimmedString;
}

export function removeInvisibleChars(inputString: string): string {
  // Define the invisible character(s) you want to remove (for example, non-breaking space)
  const invisibleCharsRegex =
    /[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]|&lrm;/g;
  const cleanedString = inputString.replace(invisibleCharsRegex, '');

  return cleanedString;
}

/**
 * Replaces multiple consecutive spaces with a single space.
 *
 * Examples:
 * normalizeSpaces("Hello  World") => "Hello World"
 * normalizeSpaces("Too    many      spaces") => "Too many spaces"
 *
 * @param inputString - The string in which to normalize spaces.
 * @returns The string with multiple spaces replaced by single spaces.
 */
export function normalizeSpaces(inputString: string): string {
  return inputString.replace(/\s{2,}/g, ' ');
}

/**
 * Removes year values in brackets (e.g., "(2025)") from a string.
 * Also normalizes any resulting double spaces.
 *
 * Examples:
 * removeYearInBrackets("Album Title (2023)") => "Album Title"
 * removeYearInBrackets("Movie (2020) - Director's Cut") => "Movie - Director's Cut"
 *
 * @param inputString - The string from which to remove year values in brackets.
 * @returns The string with year values in brackets removed and spaces normalized.
 */
export function removeYearInBrackets(inputString: string): string {
  const withoutYears = inputString.replace(/\s*\(\d{4}\)/g, '');
  return normalizeSpaces(withoutYears);
}

export function removeLeadingZeroOrColon(str: string): string {
  return str.replace(/^(:|0)*/, '');
}

export function camelCaseToReadable(str: string): string {
  let result = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}

export function convertNewlinesToBreaks(str: string): string {
  // Replace both `\r\n` and `\n` with `<br>` and remove carriage returns
  return str.replace(/\r\n|\r|\n/g, '<br>');
}

export function convertBreaksToNewlines(str: string): string {
  // Replace `<br>` with `\n` and remove carriage returns
  return str
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\r/g, '')
    .trim();
}

/** @see https://stackoverflow.com/a/8485137/3227570 */
export function safeFilename(value: string): string {
  return transliterate(value)
    .replace(/[^a-zA-Z0-9]/gi, '_')
    .toLowerCase();
}

/**
 * Normalizes Roman numerals in text by converting them to uppercase.
 * For example, "Ii" becomes "II", "Iii" becomes "III", etc.
 * Specifically excludes words like "mix" and "civic" from being treated as Roman numerals.
 *
 * @param inputString - The string in which to normalize Roman numerals.
 * @returns The string with Roman numerals converted to uppercase.
 */
export function normalizeRomanNumerals(inputString: string): string {
  // Match Roman numerals (i, v, x, l, c, d, m) in any case
  // The word boundary ensures we match isolated numerals
  return inputString.replace(/\b[ivxlcdm]+\b/gi, (match) => {
    // Exclude specific words that shouldn't be treated as Roman numerals
    const wordLower = match.toLowerCase();
    if (wordLower === 'mix' || wordLower === 'civic') {
      return match; // Return the original match for excluded words
    }

    // For other potential Roman numerals, convert to uppercase if valid
    if (/^[ivxlcdm]+$/i.test(match)) {
      return match.toUpperCase();
    }
    return match;
  });
}
