import { log } from './console';
import { camelCaseToReadable } from './string';
import { getOwnProperty, isArray, isObject, isString } from './utils';

export function elements(
  selector: string,
  parent?: Element | null
): HTMLElement[] {
  return Array.from(
    (parent ? parent : document).querySelectorAll(selector)
  ) as HTMLElement[];
}

export function element(
  selector: string,
  parent?: Element | null
): HTMLElement | null {
  return (parent ? parent : document).querySelector(selector);
}

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
 * Triggers click event on the element or array of elements
 */
export function click<T extends HTMLElement>(element: T | T[] | null): void {
  if (!element) return;
  if (isArray(element)) {
    (element as T[]).forEach((el) => click(el));
    return;
  }

  (element as T).click();

  return;
}

export function onClick<T extends HTMLElement>(
  element: T | T[] | NodeListOf<T> | null,
  callback: (event: MouseEvent) => void
): void {
  if (!element) return;
  if (!(element instanceof HTMLElement)) {
    (element as T[]).forEach((el) => onClick(el, callback));
    return;
  }
  (element as T).addEventListener('click', callback);

  return;
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

export function isCheckbox(input: HTMLInputElement): boolean {
  return input.type === 'checkbox';
}

export function removeClass<T extends HTMLElement>(
  element: T | T[] | null,
  className: string
): void {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach((e) => e.classList.remove(className));
  } else {
    element.classList.remove(className);
  }
}

export function addClass<T extends HTMLElement>(
  element: T | T[] | null,
  className: string
): void {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach((e) => e.classList.add(className));
  } else {
    element.classList.add(className);
  }
}

export function toggleClass<T extends HTMLElement>(
  element: T | T[] | null,
  className: string
): void {
  if (!element) return;
  if (Array.isArray(element)) {
    element.forEach((e) => e.classList.toggle(className));
  } else {
    element.classList.toggle(className);
  }
}

export function objectToHtml(
  object: Object,
  className: string = 'b2d-value'
): string {
  return Object.keys(object)
    .map(
      (key) =>
        `<div class="${className}"><b>${camelCaseToReadable(key)}:</b> ${valueToHtml(getOwnProperty(object, key, ''))}</div>`
    )
    .join('');
}

export function valueToHtml(value: any): string {
  if (isArray(value)) {
    return value.join(', ');
  }

  if (isObject(value)) {
    return objectToHtml(value);
  }

  return value;
}
