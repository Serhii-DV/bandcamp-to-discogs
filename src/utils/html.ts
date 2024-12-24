import { B2DIconComponent } from '../popup/components/icon';
import { log } from './console';
import { isFunction, isString } from './utils';

export function hasDataAttribute(
  element: Element,
  attributeName: string
): boolean {
  return element.hasAttribute(`data-${attributeName}`);
}

export function setDataAttribute(
  element: Element,
  attributeName: string | Record<string, string>,
  attributeValue: string = ''
): void {
  if (isString(attributeName)) {
    element.setAttribute(`data-${attributeName}`, attributeValue);
    return;
  }

  const obj = attributeName as Record<string, string>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      setDataAttribute(element, key, obj[key]);
    }
  }
}

export function getDataAttribute(
  element: Element,
  attributeName: string,
  defaultValue: string = ''
): string {
  if (hasDataAttribute(element, attributeName)) {
    const value = element.getAttribute(`data-${attributeName}`);
    return value !== null ? value : defaultValue;
  }
  return defaultValue;
}

export function show(
  ...elements: (Element | null | (Element | null)[])[]
): void {
  elements.forEach((el) => {
    if (Array.isArray(el)) {
      show(...el);
    } else if (el) {
      el.classList.remove('visually-hidden');
    }
  });
}

export function hide(
  ...elements: (Element | null | (Element | null)[])[]
): void {
  elements.forEach((el) => {
    if (Array.isArray(el)) {
      hide(...el);
    } else if (el) {
      el.classList.add('visually-hidden');
    }
  });
}

export function toggleElements(
  condition: boolean | (() => boolean),
  ...elements: (Element | null | (Element | null)[])[]
): void {
  const shouldShow = typeof condition === 'function' ? condition() : condition;

  if (shouldShow) {
    show(...elements);
  } else {
    hide(...elements);
  }
}

export function disable(
  ...elements: (
    | HTMLElement
    | HTMLInputElement
    | HTMLButtonElement
    | HTMLSelectElement
    | null
    | (
        | HTMLElement
        | HTMLInputElement
        | HTMLButtonElement
        | HTMLSelectElement
        | null
      )[]
  )[]
): void {
  elements.forEach((el) => {
    if (Array.isArray(el)) {
      disable(...el);
    } else if (el) {
      (
        el as HTMLInputElement | HTMLButtonElement | HTMLSelectElement
      ).disabled = true;
    }
  });
}

export function enable(
  ...elements: (
    | HTMLInputElement
    | HTMLButtonElement
    | HTMLSelectElement
    | null
    | (HTMLInputElement | HTMLButtonElement | HTMLSelectElement | null)[]
  )[]
): void {
  elements.forEach((el) => {
    if (Array.isArray(el)) {
      enable(...el);
    } else if (el) {
      (
        el as HTMLInputElement | HTMLButtonElement | HTMLSelectElement
      ).disabled = false;
    }
  });
}

/**
 * Triggers click event on the element
 */
export function click(element: HTMLElement): HTMLElement {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  element.dispatchEvent(event);
  return element;
}

export function onClick(
  elements: HTMLElement | NodeListOf<HTMLElement> | null,
  callback: (event: MouseEvent) => void
): void {
  if (!elements) return;

  if (elements instanceof HTMLElement) {
    elements.addEventListener('click', (event) =>
      callback(event as MouseEvent)
    );
  } else {
    elements.forEach((element) => onClick(element, callback));
  }
}

/**
 * Sets the value of an HTML input element and triggers an 'input' event if the value has changed.
 */
export function input(
  element: HTMLInputElement,
  value?: string
): HTMLInputElement {
  if (value && element.value === value) {
    return element;
  }

  if (value) {
    element.value = value;
  }

  triggerInputEvent(element);

  return element;
}

export function triggerInputEvent(
  element: HTMLInputElement,
  eventInitDict?: EventInit
): HTMLInputElement {
  element.dispatchEvent(new Event('input', eventInitDict ?? { bubbles: true }));
  return element;
}

export function createElementFromHTML(htmlString: string): Element | null {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString.trim();
  return tempDiv.firstChild as Element | null;
}

export function createDatalistFromArray(
  dataArray: string[],
  datalistId: string
): HTMLDataListElement {
  const datalist = document.createElement('datalist');
  datalist.id = datalistId;

  dataArray.forEach((optionText) => {
    const option = document.createElement('option');
    option.value = optionText;
    datalist.appendChild(option);
  });

  return datalist;
}

/**
 * Polls for changes in the content of an HTML element and calls a callback when the content changes.
 * @param element - The HTML element to monitor for content changes.
 * @param callback - The function to call when the content changes.
 * @param interval - The interval, in milliseconds, at which to poll for changes. Defaults to 1000 ms.
 * @returns A function to stop the polling.
 */
export function contentChangeWithPolling(
  element: HTMLElement,
  callback: (newContent: string) => void,
  interval: number = 1000
): () => void {
  let previousContent = element.textContent;

  const poller = setInterval(() => {
    const currentContent = element.textContent;
    if (currentContent !== previousContent) {
      callback(currentContent || '');
      previousContent = currentContent;
    }
  }, interval);

  // Return a function to stop the polling
  return function stopPolling() {
    clearInterval(poller);
  };
}

/**
 * Selects an element within a root element that contains specific content.
 * @param rootElement - The root element to search within.
 * @param querySelector - The CSS selector to match elements.
 * @param content - The content to look for within the elements.
 * @returns The first element that contains the specified content, or `null` if none found.
 */
export function selectElementWithContent(
  rootElement: Element,
  querySelector: string,
  content: string
): Element | null {
  const elements = rootElement.querySelectorAll(querySelector);

  for (const element of elements) {
    if (element.textContent?.includes(content)) {
      return element;
    }
  }

  return null;
}

/**
 */
export function getCurrentUrl(): string {
  return window.location.href;
}

/**
 * Observes changes to a specified attribute on a given HTMLElement
 * and runs a callback function when changes are detected.
 *
 * @param element - The element to observe.
 * @param attributeName - The name of the attribute to observe.
 * @param callback - The function to call when the attribute changes.
 */
export function observeAttributeChange(
  element: HTMLElement,
  attributeName: string,
  callback: (element: HTMLElement) => void
): void {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === attributeName
      ) {
        callback(element);
      }
    }
  });

  const config = { attributes: true, attributeFilter: [attributeName] };
  observer.observe(element, config);
}

/**
 * Injects a CSS file into the document by creating a link element.
 */
export function injectCSSFile(cssUrl: string): void {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = cssUrl;
  linkElement.onload = () => {
    log('Injected css file:', cssUrl);
  };

  document.head.appendChild(linkElement);
}

/**
 * Injects a JavaScript file into the document by creating a script element.
 */
export function injectJSFile(
  url: string,
  callback: ((this: GlobalEventHandlers, ev: Event) => any) | null = null
): void {
  const scriptElement = document.createElement('script');
  scriptElement.src = url;
  scriptElement.onload = callback;
  (document.head || document.documentElement).appendChild(scriptElement);
}

type MessageEventData = {
  type: string;
  [key: string]: any;
};

export function listenForMessage(
  dataType: string,
  onMessage: (data: any) => void
): void {
  window.addEventListener('message', (event: MessageEvent) => {
    if (event.source !== window) return;

    const eventData = event.data as MessageEventData;

    if (eventData.type && eventData.type === dataType) {
      log('Message listener got message', eventData);
      onMessage(eventData);
    }
  });
}

interface CreateIconLinkParams {
  className?: string;
  href?: string;
  onClick?: (event: MouseEvent) => any;
  title?: string;
  iconDefault: string;
  iconOnClick?: string;
  iconOnClickTimeout?: number;
}

export const createIconLink = ({
  className = 'icon-link',
  href = '#',
  onClick,
  title = '',
  iconDefault,
  iconOnClick,
  iconOnClickTimeout = 3000
}: CreateIconLinkParams): HTMLAnchorElement => {
  const link = document.createElement('a');
  link.classList.add(className);
  link.title = title;
  link.href = href;
  link.target = '_blank';
  link.innerHTML = `<b2d-icon name="${iconDefault}"></b2d-icon>`;

  if (onClick && isFunction(onClick)) {
    link.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      const eventReturn = onClick(e);

      if (iconOnClick) {
        const icon = link.querySelector('b2d-icon');
        if (icon instanceof B2DIconComponent) {
          icon.setIcon(iconOnClick);
          setTimeout(() => {
            icon.setIcon(iconDefault);
          }, iconOnClickTimeout);
        }
      }

      return eventReturn;
    });
  }

  return link;
};

export function setActiveTab(
  activeTab: HTMLElement | null,
  tabs: (HTMLElement | null)[]
): void {
  if (!activeTab) return;

  for (const tab of tabs) {
    if (!tab) continue;
    if (tab === activeTab) {
      tab.classList.remove('d-none');
    } else {
      tab.classList.add('d-none');
    }
  }
}

export function getVisibleElement(
  elements: (HTMLElement | null)[]
): HTMLElement | undefined {
  return elements.find((element) => isElementVisible(element)) || undefined;
}

export function isElementVisible(element: HTMLElement | null): boolean {
  if (!element) {
    return false;
  }

  const style = getComputedStyle(element);
  return (
    !element.classList.contains('d-none') &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}
