import {
  isEmptyObject,
  hasOwnProperty,
  getOwnProperty,
  isString,
  isObject,
  isArray,
  isFunction,
  isEmptyArray,
  arrayUnique,
  hasClass,
  getArrLastElement,
  replaceTokens,
  countOccurrences,
  bytesToSize
} from './utils';

describe('Utility Functions', () => {
  describe('isEmptyObject', () => {
    it('should return true for an empty object', () => {
      expect(isEmptyObject({})).toBe(true);
    });

    it('should return false for a non-empty object', () => {
      expect(isEmptyObject({ key: 'value' })).toBe(false);
    });
  });

  describe('hasOwnProperty', () => {
    it('should return true if the object has the property', () => {
      expect(hasOwnProperty({ a: 1 }, 'a')).toBe(true);
    });

    it('should return false if the object does not have the property', () => {
      expect(hasOwnProperty({ a: 1 }, 'b')).toBe(false);
    });
  });

  describe('getOwnProperty', () => {
    it('should return the property value if it exists', () => {
      expect(getOwnProperty({ a: 1 }, 'a', 0)).toBe(1);
    });

    it('should return the default value if the property does not exist', () => {
      expect(getOwnProperty({ a: 1 }, 'b', 0)).toBe(0);
    });
  });

  describe('isString', () => {
    it('should return true for a string', () => {
      expect(isString('hello')).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: 'value' })).toBe(true);
    });

    it('should return false for non-object values', () => {
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject('test')).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray(['a', 'b'])).toBe(true);
    });

    it('should return false for non-array values', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('test')).toBe(false);
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
    });

    it('should return false for non-function values', () => {
      expect(isFunction(123)).toBe(false);
      expect(isFunction('test')).toBe(false);
    });
  });

  describe('isEmptyArray', () => {
    it('should return true for an empty array', () => {
      expect(isEmptyArray([])).toBe(true);
    });

    it('should return false for a non-empty array', () => {
      expect(isEmptyArray(['a'])).toBe(false);
    });
  });

  describe('arrayUnique', () => {
    it('should return an array with unique values', () => {
      expect(arrayUnique(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });

    it('should flatten and remove duplicates in a nested array', () => {
      expect(
        arrayUnique([
          ['a', 'b'],
          ['a', 'c']
        ])
      ).toEqual(['a', 'b', 'c']);
    });
  });

  describe('hasClass', () => {
    it('should return true if the element has the class', () => {
      const div = document.createElement('div');
      div.classList.add('test');
      expect(hasClass(div, 'test')).toBe(true);
    });

    it('should return false if the element does not have the class', () => {
      const div = document.createElement('div');
      expect(hasClass(div, 'test')).toBe(false);
    });

    it('should return false for null elements', () => {
      expect(hasClass(null, 'test')).toBe(false);
    });
  });

  describe('getArrLastElement', () => {
    it('should return the last element of the array', () => {
      expect(getArrLastElement([1, 2, 3])).toBe(3);
    });

    it('should return undefined for an empty array', () => {
      expect(getArrLastElement([])).toBeUndefined();
    });
  });

  describe('replaceTokens', () => {
    it('should replace tokens in the template', () => {
      expect(replaceTokens('Hello {name}', { name: 'World' })).toBe(
        'Hello World'
      );
    });

    it('should replace multiple occurrences of the same token', () => {
      expect(replaceTokens('{name} is {name}', { name: 'Alice' })).toBe(
        'Alice is Alice'
      );
    });

    it('should not replace undefined tokens', () => {
      expect(replaceTokens('Hello {name}', {})).toBe('Hello {name}');
    });
  });

  describe('countOccurrences', () => {
    it('should count occurrences of elements in an array', () => {
      expect(countOccurrences(['apple', 'banana', 'apple'])).toEqual([
        'apple (2)',
        'banana'
      ]);
    });

    it('should be case insensitive', () => {
      expect(countOccurrences(['Apple', 'apple', 'Banana'])).toEqual([
        'Apple (2)',
        'Banana'
      ]);
    });

    it('should return an empty array for an empty input', () => {
      expect(countOccurrences([])).toEqual([]);
    });
  });

  describe('bytesToSize', () => {
    it('should convert bytes to a human-readable format', () => {
      expect(bytesToSize(0)).toBe('0 Bytes');
      expect(bytesToSize(1024)).toBe('1.00 KB');
      expect(bytesToSize(1048576)).toBe('1.00 MB');
      expect(bytesToSize(1073741824)).toBe('1.00 GB');
      expect(bytesToSize(1099511627776)).toBe('1.00 TB');
    });

    it('should handle edge cases correctly', () => {
      expect(bytesToSize(500)).toBe('500.00 Bytes');
      expect(bytesToSize(1536)).toBe('1.50 KB');
    });
  });
});
