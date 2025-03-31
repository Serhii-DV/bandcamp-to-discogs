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

export function arrayUnique(arr: string[] | string[][]): string[] {
  return [...new Set(arr.flat())];
}

export function hasClass(
  element: Element | HTMLElement | null,
  className: string
): boolean {
  return !!element?.classList.contains(className);
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

export function bytesToSize(bytes: number): string {
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const roundedSize = (bytes / Math.pow(1024, i)).toFixed(2);
  return `${roundedSize} ${sizes[i]}`;
}
