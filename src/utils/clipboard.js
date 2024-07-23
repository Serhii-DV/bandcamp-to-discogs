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
      }, 3000);
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

/**
 * Creates a new Clipboard link element
 * @param {string} content
 * @returns {HTMLElement}
 */
export const createClipboardLink = (content) => {
  const link = document.createElement("a");
  link.classList.add('clipboard-link');
  link.href = '#';
  link.innerHTML = `<b2d-icon name="clipboard"></b2d-icon>`;

  if (content) {
    initClipboard(link, content);
  }

  return link;
};
