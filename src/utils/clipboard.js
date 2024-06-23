/**
 * @param {HTMLElement} element
 * @param {string} content
 */
export const initClipboard = (element, content) => {
  element.addEventListener('click', () => {
    const icon = element.querySelector('b2d-icon');
    copyToClipboard(content ?? element.getAttribute('data-content')).then(() => {
      const initIconName = icon.getAttribute('name');
      icon.setIcon('clipboard2-check-fill');
      setTimeout(() => {
        icon.setIcon(initIconName);
      }, 3000)
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
