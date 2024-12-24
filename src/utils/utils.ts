import { transliterate } from './transliterate';

export function padStringLeft(
  string: string,
  pad: string,
  length: number
): string {
  const padding =
    string.length >= length ? '' : pad.repeat(length - string.length);
  return padding + string;
}

/** @see https://stackoverflow.com/a/8485137/3227570 */
export function safeFilename(value: string): string {
  return transliterate(value)
    .replace(/[^a-zA-Z0-9]/gi, '_')
    .toLowerCase();
}

/** @see https://flexiple.com/javascript/javascript-capitalize-first-letter/ */
export function capitalizeEachWord(str: string): string {
  const words = str.split(' ');
  const capitalizedWords = words.map((word: string) => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);
    return `${firstLetter}${restOfWord}`;
  });

  return capitalizedWords.join(' ');
}

export function convertToAlias(str: string): string {
  const slug = str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const trimmedSlug = slug.replace(/^-+|-+$/g, '');
  return trimmedSlug;
}

export function isEmptyObject(obj: object): boolean {
  for (const key in obj) {
    if (hasOwnProperty(obj, key)) {
      return false;
    }
  }
  return true;
}

export interface ObjectByStringKey {
  [key: string]: any;
}

export function hasOwnProperty(obj: ObjectByStringKey, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function getOwnProperty(
  obj: ObjectByStringKey,
  key: string,
  defaultValue: any
): any {
  return hasOwnProperty(obj, key) ? obj[key] : defaultValue;
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isObject(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value: any): boolean {
  return Array.isArray(value);
}

export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

export function isEmptyArray(value: any[]): boolean {
  return !isArray(value) || value.length === 0;
}

export function arrayUnique(arr: string[][]): string[] {
  return [...new Set(arr.flat())];
}

export function hasClass(
  element: Element | HTMLElement | null,
  className: string
) {
  return element?.classList.contains(className);
}

export function getArrLastElement(array: Array<any>) {
  return array[array.length - 1];
}

/**
 * Replace tokens in a template string with their corresponding values.
 */
export function replaceTokens(
  template: string,
  replacements: Record<string, string | undefined>
): string {
  for (const key in replacements) {
    if (hasOwnProperty(replacements, key)) {
      template = template.replace(
        new RegExp(`{${key}}`, 'g'),
        replacements[key] ?? ''
      );
    }
  }
  return template;
}

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
  for (const string2 of arrayOfStrings) {
    if (string1.includes(string2)) {
      return true;
    }
  }
  return false;
}

/**
 * Counts the occurrences of each unique element in an array and formats the result.
 * @param arr - The array of strings to count occurrences in.
 * @returns An array of strings where each string represents an item and its count (if greater than 1).
 */
export function countOccurrences(arr: string[]): string[] {
  const count = new Map<string, number>();
  const items = new Map<string, string>();
  const result: string[] = [];

  for (const item of arr) {
    const key = item.toLowerCase();

    if (!items.has(key)) {
      items.set(key, item);
    }

    count.set(key, (count.get(key) || 0) + 1);
  }

  for (const [key, item] of items) {
    const value = count.get(key) || 0;
    if (value > 1) {
      result.push(`${item} (${value})`);
    } else {
      result.push(item);
    }
  }

  return result;
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

export function bytesToSize(bytes: number): string {
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const roundedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${roundedSize} ${sizes[i]}`;
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
  return str.replace(/\n/g, '<br>').replace(/\r/g, '');
}
