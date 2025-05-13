import { arrayUnique } from '../../utils/utils';

export type MetadataValue = string | string[];

export function metadataValueAsArray(value: MetadataValue): string[] {
  return Array.isArray(value) ? value : [value];
}

export function metadataValueAsString(value: MetadataValue): string {
  return Array.isArray(value) ? (value[0] as string) : value;
}

/**
 * Class that encapsulates MetadataValue handling with convenient toString and toArray methods
 */
export class MetadataValueObject {
  private value: MetadataValue;

  constructor(value: MetadataValue) {
    this.value = value;
  }

  /**
   * Converts the value to an array
   * - If value is already an array, returns the array
   * - If value is a string, returns an array containing the string
   */
  toArray(): string[] {
    return metadataValueAsArray(this.value);
  }

  /**
   * Converts the value to a string
   * - If value is a string, returns the string
   * - If value is an array, returns the first element as a string
   */
  toString(): string {
    return metadataValueAsString(this.value);
  }
}

/**
 * Converts MetadataValue based on its content:
 * - If it's a string, returns the string.
 * - If it's an array, applies `arrayUnique` to remove duplicates.
 *   - If the resulting array has a single element, returns that element as a string.
 *   - If the resulting array has more than one element, returns the array as-is.
 */
export function convertMetadataValue(value: MetadataValue): string | string[] {
  if (Array.isArray(value)) {
    const uniqueArray = arrayUnique(value);
    return uniqueArray.length === 1 ? uniqueArray[0] : uniqueArray;
  }
  return value;
}
