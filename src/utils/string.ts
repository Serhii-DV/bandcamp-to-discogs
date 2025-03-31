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
    .split(/(\s+|["'“”‘’,.()!?\-])/g) // Split by spaces and special characters, keeping them as separators
    .map(
      (word) =>
        /^[a-zA-Z]/.test(word) // Check if the word starts with a letter
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word // Leave separators and non-alphabetic parts as they are
    )
    .join('');
}
