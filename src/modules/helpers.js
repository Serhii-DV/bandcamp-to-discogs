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
