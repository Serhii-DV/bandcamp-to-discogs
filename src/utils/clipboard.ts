import { B2DIconComponent } from 'src/popup/components/icon';
import { isFunction } from './utils';

type VoidCallback = (value: void) => void | PromiseLike<void>;

export const initClipboard = (
  element: Element,
  content: string,
  callback: VoidCallback,
  iconFillName: string
): void => {
  element.addEventListener('click', () => {
    const promise = copyToClipboard(
      content ?? element.getAttribute('data-content')
    );
    const icon = element.querySelector('b2d-icon') as B2DIconComponent;

    if (icon) {
      promise.then(() => {
        const initIconName = icon.getAttribute('name');
        icon.setIcon(iconFillName);
        setTimeout(() => {
          icon.setIcon(initIconName);
        }, 3000);
      });
    }

    if (isFunction(callback)) {
      promise.then(callback);
    }
  });
};

export const copyToClipboard = (str: string): Promise<void> => {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(str);
  return Promise.reject('The Clipboard API is not available.');
};

/**
 * Creates a new Clipboard link element
 */
export const createClipboardLink = ({
  content,
  onDone,
  iconName = 'clipboard',
  iconFillName = 'clipboard2-check-fill',
  title = ''
}: {
  content: string;
  onDone: () => void;
  iconName?: string;
  iconFillName?: string;
  title?: string;
}): HTMLElement => {
  const link = document.createElement('a');
  link.classList.add('clipboard-link');
  link.title = title;
  link.href = '#';
  link.innerHTML = `<b2d-icon name="${iconName}"></b2d-icon>`;

  if (content) {
    initClipboard(link, content, onDone, iconFillName);
  }

  return link;
};
