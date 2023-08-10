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
 * Converts a JavaScript object to an HTML element representing a table.
 * @param {Object} data - The JavaScript object to convert.
 * @returns {Node} - The HTML element representing the converted table.
 */
export function objectToHtmlElement(data) {
  if (!isObject(data) && !isArray(data)) {
    return document.createTextNode(data);
  }

  const table = document.createElement("table");
  table.classList.add("table", "table-sm", "table-striped", "table-bordered");

  for (const [key, value] of Object.entries(data)) {
    const row = document.createElement("tr");
    const keyCell = document.createElement("th");
    const valueCell = document.createElement("td");

    keyCell.classList.add("w-25");
    valueCell.classList.add("w-auto");

    keyCell.textContent = key;

    if (isObject(value)) {
      valueCell.appendChild(objectToHtmlElement(value));
    } else if (isArray(value)) {
      valueCell.innerHTML = value
        .map(item => (isString(item) ? item : objectToHtmlElement(item).outerHTML))
        .join(", ");
    } else {
      valueCell.innerHTML = isString(value)
        ? value.replace(/[\r\n]+/g, "<br/>")
        : value;
    }

    row.appendChild(keyCell);
    row.appendChild(valueCell);
    table.appendChild(row);
  }

  return table;
}

/**
 * Converts an object into a nested HTML <details> element with key-value pairs.
 *
 * @param {Object} obj - The input object to be converted into a details element.
 * @param {string} [title=''] - An optional title for the top-level <summary> element.
 * @returns {HTMLElement} The generated <details> element representing the object's structure.
 */
export function objectToDetailsElement(obj, title = '') {
  const detailsElement = document.createElement('details');
  const summaryElement = document.createElement('summary');
  summaryElement.textContent = title;
  detailsElement.appendChild(summaryElement);

  Object.entries(obj).forEach(([key, value]) => {
    if ((isObject(value) || isArray(value)) && value !== null) {
      const nestedDetails = objectToDetailsElement(value, key);
      detailsElement.appendChild(nestedDetails);
    } else {
      const keyValueDetails = createKeyValueDetails(key, value);
      detailsElement.appendChild(keyValueDetails);
    }
  });

  return detailsElement;
}

/**
 * Creates a <details> element with a key-value pair.
 *
 * @param {string} key - The key (property name) of the object property.
 * @param {*} value - The value associated with the key.
 * @returns {HTMLElement} The generated <details> element representing the key-value pair.
 */
export function createKeyValueDetails(key, value) {
  const keyValueDetails = document.createElement('details');
  const summaryElement = document.createElement('summary');
  summaryElement.textContent = key;
  keyValueDetails.appendChild(summaryElement);

  const valueElement = document.createElement('div');

  if (value instanceof HTMLElement) {
    valueElement.appendChild(value);
  } else {
    valueElement.textContent = value instanceof Date ? value.toISOString() : value;
  }

  keyValueDetails.appendChild(valueElement);

  return keyValueDetails;
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
