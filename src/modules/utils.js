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
 * @returns {Array}
 */
export function explodeString(inputString) {
  const delimiters = /[,/&]+/;
  const resultArray = inputString.split(delimiters);
  return resultArray
    .map(item => item.trim())
    .filter(item => item !== '');
}
