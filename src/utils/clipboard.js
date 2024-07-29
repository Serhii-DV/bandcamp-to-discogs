import { isFunction } from "../modules/utils";

/**
 * @param {HTMLElement} element
 * @param {string} content
 * @param {Function} callback
 */
export const initClipboard = (element, content, callback, iconFillName) => {
  element.addEventListener('click', () => {
    const icon = element.querySelector('b2d-icon');
    const promise = copyToClipboard(content ?? element.getAttribute('data-content')).then(() => {
      const initIconName = icon.getAttribute('name');
      icon.setIcon(iconFillName);
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
export const createClipboardLink = ({content, onDone, iconName = 'clipboard', iconFillName = 'clipboard2-check-fill', title = ''}) => {
  const link = document.createElement("a");
  link.classList.add('clipboard-link');
  link.title = title;
  link.href = '#';
  link.innerHTML = `<b2d-icon name="${iconName}"></b2d-icon>`;

  if (content) {
    initClipboard(link, content, onDone, iconFillName);
  }

  return link;
};
