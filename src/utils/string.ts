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

export function removeLeadingZeroOrColon(str: string): string {
  return str.replace(/^(:|0)*/, '');
}

export function camelCaseToReadable(str: string): string {
  let result = str.replace(/([a-z])([A-Z])/g, '$1 $2');
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}
