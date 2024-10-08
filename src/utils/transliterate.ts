/** @see https://stackoverflow.com/a/11404121 */
const transliterationMap = [
  { ru: 'Ё', en: 'YO' },
  { ru: 'Й', en: 'I' },
  { ru: 'Ц', en: 'TS' },
  { ru: 'У', en: 'U' },
  { ru: 'К', en: 'K' },
  { ru: 'Е', en: 'E' },
  { ru: 'Н', en: 'N' },
  { ru: 'Г', en: 'G' },
  { ru: 'Ш', en: 'SH' },
  { ru: 'Щ', en: 'SCH' },
  { ru: 'З', en: 'Z' },
  { ru: 'Х', en: 'H' },
  { ru: 'Ъ', en: "'" },
  { ru: 'ё', en: 'yo' },
  { ru: 'й', en: 'i' },
  { ru: 'ц', en: 'ts' },
  { ru: 'у', en: 'u' },
  { ru: 'к', en: 'k' },
  { ru: 'е', en: 'e' },
  { ru: 'н', en: 'n' },
  { ru: 'г', en: 'g' },
  { ru: 'ш', en: 'sh' },
  { ru: 'щ', en: 'sch' },
  { ru: 'з', en: 'z' },
  { ru: 'х', en: 'h' },
  { ru: 'ъ', en: "'" },
  { ru: 'Ф', en: 'F' },
  { ru: 'Ы', en: 'I' },
  { ru: 'В', en: 'V' },
  { ru: 'А', en: 'A' },
  { ru: 'П', en: 'P' },
  { ru: 'Р', en: 'R' },
  { ru: 'О', en: 'O' },
  { ru: 'Л', en: 'L' },
  { ru: 'Д', en: 'D' },
  { ru: 'Ж', en: 'ZH' },
  { ru: 'Э', en: 'E' },
  { ru: 'ф', en: 'f' },
  { ru: 'ы', en: 'i' },
  { ru: 'в', en: 'v' },
  { ru: 'а', en: 'a' },
  { ru: 'п', en: 'p' },
  { ru: 'р', en: 'r' },
  { ru: 'о', en: 'o' },
  { ru: 'л', en: 'l' },
  { ru: 'д', en: 'd' },
  { ru: 'ж', en: 'zh' },
  { ru: 'э', en: 'e' },
  { ru: 'Я', en: 'Ya' },
  { ru: 'Ч', en: 'CH' },
  { ru: 'С', en: 'S' },
  { ru: 'М', en: 'M' },
  { ru: 'И', en: 'I' },
  { ru: 'Т', en: 'T' },
  { ru: 'Ь', en: "'" },
  { ru: 'Б', en: 'B' },
  { ru: 'Ю', en: 'YU' },
  { ru: 'я', en: 'ya' },
  { ru: 'ч', en: 'ch' },
  { ru: 'с', en: 's' },
  { ru: 'м', en: 'm' },
  { ru: 'и', en: 'i' },
  { ru: 'т', en: 't' },
  { ru: 'ь', en: "'" },
  { ru: 'б', en: 'b' },
  { ru: 'ю', en: 'yu' }
];

export function transliterate(word: string): string {
  return Array.from(word)
    .map((char) => {
      const transliteration = transliterationMap.find(
        (entry) => entry.ru === char
      );
      return transliteration ? transliteration.en : char;
    })
    .join('');
}
