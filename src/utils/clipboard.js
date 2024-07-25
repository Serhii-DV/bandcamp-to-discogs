import { isFunction } from "../modules/utils";

/**
 * @param {HTMLElement} element
 * @param {string} content
 * @param {Function} callback
 */
export const initClipboard = (element, content, callback) => {
  element.addEventListener('click', () => {
    const icon = element.querySelector('b2d-icon');
    const promise = copyToClipboard(content ?? element.getAttribute('data-content')).then(() => {
      const initIconName = icon.getAttribute('name');
      icon.setIcon('clipboard2-check-fill');
      setTimeout(() => {
        icon.setIcon(initIconName);
      }, 3000);
    });

    if (isFunction(callback)) {
      promise.then(callback);
    }
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
 * @param {Function} onDone
 * @returns {HTMLElement}
 */
export const createClipboardLink = (content, onDone) => {
  const link = document.createElement("a");
  link.classList.add('clipboard-link');
  link.href = '#';
  link.innerHTML = `<b2d-icon name="clipboard"></b2d-icon>`;

  if (content) {
    initClipboard(link, content, onDone);
  }

  return link;
};
