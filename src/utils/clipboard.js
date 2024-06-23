/**
 * @param {HTMLElement} element
 * @param {string} content
 */
export const initClipboard = (element, content) => {
  element.addEventListener('click', () => {
    copyToClipboard(content ?? element.getAttribute('data-content'));
  });
};

/**
 * @param {string} str
 * @returns {Promise}
 */
export const copyToClipboard = str => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str);
  return Promise.reject('The Clipboard API is not available.');
};
