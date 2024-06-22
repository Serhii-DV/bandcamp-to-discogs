/**
 * @param {HTMLElement[]} elements
 */
export const initClipboard = elements => {
  if (Array.isArray(elements)) {
    elements.forEach(el => {
      initClipboardElement(el);
    });
    return;
  }

  initClipboardElement(elements);
};

const initClipboardElement = el => {
  el.addEventListener('click', () => {
    const text = el.getAttribute('data-content');

    copyToClipboard(text).then(() => {
      alert(text);
    });
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
