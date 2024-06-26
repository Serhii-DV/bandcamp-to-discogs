/**
 * @param {String} string
 * @param {String} pad
 * @param {Number} length
 * @returns {String}
 */
export function padStringLeft(string, pad, length) {
  const padding = string.length >= length ? '' : pad.repeat(length - string.length);
  return padding + string;
}

/** @see https://stackoverflow.com/a/8485137/3227570 */
export function safeFilename(value) {
  return transliterate(value).replace(/[^a-zA-Z0-9]/gi, '_').toLowerCase();
}

/** @see https://stackoverflow.com/a/11404121 */
const transliterationMap = {
  "Ё": "YO", "Й": "I", "Ц": "TS", "У": "U", "К": "K", "Е": "E", "Н": "N", "Г": "G", "Ш": "SH", "Щ": "SCH", "З": "Z", "Х": "H", "Ъ": "'", "ё": "yo", "й": "i", "ц": "ts", "у": "u", "к": "k", "е": "e", "н": "n", "г": "g", "ш": "sh", "щ": "sch", "з": "z", "х": "h", "ъ": "'", "Ф": "F", "Ы": "I", "В": "V", "А": "A", "П": "P", "Р": "R", "О": "O", "Л": "L", "Д": "D", "Ж": "ZH", "Э": "E", "ф": "f", "ы": "i", "в": "v", "а": "a", "п": "p", "р": "r", "о": "o", "л": "l", "д": "d", "ж": "zh", "э": "e", "Я": "Ya", "Ч": "CH", "С": "S", "М": "M", "И": "I", "Т": "T", "Ь": "'", "Б": "B", "Ю": "YU", "я": "ya", "ч": "ch", "с": "s", "м": "m", "и": "i", "т": "t", "ь": "'", "б": "b", "ю": "yu"
};

function transliterate(word) {
  return Array.from(word).map(char => transliterationMap[char] || char).join("");
}

/** @see https://flexiple.com/javascript/javascript-capitalize-first-letter/ */
export function capitalizeEachWord(str) {
  const words = str.split(" ");

  const capitalizedWords = words.map(word => {
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);
    return `${firstLetter}${restOfWord}`;
  });

  return capitalizedWords.join(" ");
}

export function convertToAlias(str) {
  const slug = str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const trimmedSlug = slug.replace(/^-+|-+$/g, '');
  return trimmedSlug;
}

export function isEmptyObject(obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function isString(value) {
  return typeof value === 'string';
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isArray(value) {
  return Array.isArray(value);
}

export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * @param {Array} value
 * @returns {Boolean}
 */
export function isEmptyArray(value) {
  return !isArray(value) || value.length === 0;
}

/**
 * @param {Array<Array<String>>}
 * @return {Array<String>}
 */
export function arrayToFlat(arr) {
  return [].concat(...arr);
}

/**
 * @param {Array<Array<String>|String>}
 * @return {Array<String>}
 */
export function arrayUnique(arr) {
  return [...new Set(arrayToFlat(arr))];
}

/**
 * @param {Element} element
 * @param {String} className
 * @returns {Boolean}
 */
export function hasClass(element, className) {
  return element.classList.contains(className);
}

/**
 * @param {String} url
 * @param {Element} targetElement
 * @returns {Promise}
 */
export function loadHTMLContent(url, targetElement) {
  return fetch(url)
      .then(response => response.text())
      .then(htmlContent => {
          targetElement.innerHTML = htmlContent;
          return targetElement;
      })
      .catch(error => console.error('Error loading HTML content:', error));
}

/**
 * Replace tokens in a template string with their corresponding values.
 * @param {string} template - The template string with tokens to be replaced.
 * @param {object} replacements - An object containing key-value pairs for replacements.
 * @returns {string} - The template string with tokens replaced by their values.
 */
export function replaceTokens(template, replacements) {
  for (const key in replacements) {
    if (replacements.hasOwnProperty(key)) {
      template = template.replace(`{${key}}`, replacements[key]);
    }
  }
  return template;
}

/**
 * @param {String} cssUrl
 */
export function injectCSSFile(cssUrl) {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = cssUrl;

  document.head.appendChild(linkElement);
}

export function injectJSFile(url, callback) {
  const s = window.document.createElement('script');
  s.src = url;
  s.onload = isFunction(callback) ? callback() : () => { console.log(`B2D: Script ${url} was injected!`); };
  (document.head||document.documentElement).appendChild(s);
}

/**
 * @param {String} inputString
 * @param {RegExp|String} delimiters
 * @returns {Array}
 */
export function splitString(inputString, delimiters) {
  const resultArray = inputString.split(delimiters);
  return resultArray
    .map(item => item.trim())
    .filter(item => item !== '');
}

export function containsOneOf(string1, arrayOfStrings) {
  // This function checks if a string contains one of the strings in an array of strings.

  // Args:
  //   string1: The string to check.
  //   arrayOfStrings: The array of strings to look for.

  // Returns:
  //   True if string1 contains one of the strings in arrayOfStrings, False otherwise.

  for (const string2 of arrayOfStrings) {
    if (string1.includes(string2)) {
      return true;
    }
  }
  return false;
}

export function countOccurrences(arr) {
  const count = new Map();
  const items = new Map();
  const result = [];

  // Count occurrences of each element in the array
  for (const item of arr) {
      const key = item.toLowerCase();

      if (!items.has(key)) {
        items.set(key, item);
      }

      count.set(key, (count.get(key) || 0) + 1);
  }

  for (const [key, item] of items) {
    const value = count.get(key);
    if (value > 1) {
      result.push(`${item} (${value})`);
    } else {
      result.push(item);
    }
  }

  return result;
}

export function removeBrackets(inputString) {
  // Use a regular expression to remove the brackets and their contents
  return inputString.replace(/\s*\([^)]*\)/, '');
}

export function trimCharactersFromString(inputString, charactersToTrim) {
  // Escape special characters within the provided string and construct the regex pattern
  const escapedCharacters = charactersToTrim.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regexPattern = new RegExp(`^[${escapedCharacters}]+|[${escapedCharacters}]+$`, 'g');
  const trimmedString = inputString.replace(regexPattern, '');

  return trimmedString;
}

export function removeInvisibleChars(inputString) {
  // Define the invisible character(s) you want to remove (for example, non-breaking space)
  const invisibleCharsRegex = /[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]|&lrm;/g;
  // Use the regular expression to remove invisible characters
  const cleanedString = inputString.replace(invisibleCharsRegex, '');

  return cleanedString;
}

export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Byte';

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function removeLeadingZeroOrColon(str) {
  // Use a regular expression to match leading zeros or colons
  // and replace them with an empty string
  return str.replace(/^(:|0)*/, '');
}
