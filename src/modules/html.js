import { isArray, isFunction, isObject, isString } from "../utils/utils";

export function hasDataAttribute(element, attributeName) {
  return element.hasAttribute(`data-${attributeName}`);
}

export function setDataAttribute(element, attributeName, attributeValue = '') {
  if (isObject(attributeName)) {
    const obj = attributeName;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        setDataAttribute(element, key, obj[key]);
      }
    }
    return;
  }
  element.setAttribute(`data-${attributeName}`, attributeValue);
}

export function getDataAttribute(element, attributeName, defaultValue = undefined) {
  return hasDataAttribute(element, attributeName) ? element.getAttribute(`data-${attributeName}`) : defaultValue;
}

export function show(...element) {
  element.forEach(el => isArray(el) ? show(...el) : el.classList.remove('visually-hidden'));
}

export function hide(...element) {
  element.forEach(el => isArray(el) ? hide(...el) : el.classList.add('visually-hidden'));
}

export function disable(...element) {
  element.forEach(el => isArray(el) ? disable(...el) : (el.disabled = true));
}

export function enable(...element) {
  element.forEach(el => isArray(el) ? enable(...el) : (el.disabled = false));
}

/**
 * Triggers click event on the element
 * @param {Element} element
 */
export function click(element) {
  var event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
  });
  element.dispatchEvent(event);
  return element;
}

/**
 * Triggers input event on element
 * @param {Element} element
 */
export function input(element, value) {
  if (isString(value)) {
    // Trigger input event only when the value has changed
    if (element.value !== value) {
      element.value = value;
      triggerInputEvent(element);
    }

    return element;
  }

  triggerInputEvent(element);
  return element;
}

function triggerInputEvent(element) {
  element.dispatchEvent(new Event('input'));
  return element;
}

/**
 * @param {String} htmlString
 * @returns {Element}
 */
export function createElementFromHTML(htmlString) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlString.trim();
  return tempDiv.firstChild;
}

export function createSelectListFromArray(arrayOfObjects, selectId) {
  const selectElement = document.createElement('select');
  selectElement.id = selectId; // Set the id for the select element

  arrayOfObjects.forEach((obj) => {
    const optionElement = document.createElement('option');
    optionElement.value = obj.value;
    optionElement.text = obj.text;
    selectElement.appendChild(optionElement);
  });

  return selectElement;
}

export function createDataListFromArray(arrayOfObjects, selectId) {
  const selectElement = document.createElement('select');
  selectElement.id = selectId; // Set the id for the select element

  arrayOfObjects.forEach((obj) => {
    const optionElement = document.createElement('option');
    optionElement.value = obj.value;
    optionElement.text = obj.text;
    selectElement.appendChild(optionElement);
  });

  return selectElement;
}

export function createDatalistFromArray(dataArray, datalistId) {
  const datalist = document.createElement('datalist');
  datalist.id = datalistId;

  dataArray.forEach((optionText) => {
    const option = document.createElement('option');
    option.value = optionText;
    datalist.appendChild(option);
  });

  return datalist;
}

export function contentChangeWithPolling(element, callback, interval = 1000) {
  let previousContent = element.textContent;

  const poller = setInterval(() => {
    const currentContent = element.textContent;
    if (currentContent !== previousContent) {
      callback(currentContent);
      previousContent = currentContent;
    }
  }, interval);

  // Optionally, you can return a function to stop the polling when needed
  return function stopPolling() {
    clearInterval(poller);
  };
}

export function selectElementWithContent(rootElement, querySelector, content) {
  const elements = rootElement.querySelectorAll(querySelector);

  for (const element of elements) {
    if (element.textContent.includes(content)) {
      return element;
    }
  }

  return null;
}

export function isElementDisplayNone(element) {
  return window.getComputedStyle(element).display === 'none';
}

export function isHtmlElement(element) {
  return element instanceof HTMLElement;
}

export function getCurrentUrl() {
  return window.location.href;
}

/**
 * Observes changes to a specified attribute on a given HTMLElement
 * and runs a callback function when changes are detected.
 *
 * @param {HTMLElement} element - The element to observe.
 * @param {string} attributeName - The name of the attribute to observe.
 * @param {Function} callback - The function to call when the attribute changes.
 */
export function observeAttributeChange(element, attributeName, callback) {
  const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === attributeName) {
              callback(element);
          }
      }
  });

  const config = { attributes: true, attributeFilter: [attributeName] };
  observer.observe(element, config);
}

/**
 * @param {String} cssUrl
 */
export function injectCSSFile(cssUrl) {
  const linkElement = document.createElement('link');
  linkElement.rel = 'stylesheet';
  linkElement.href = cssUrl;
  linkElement.onload = () => {
    console.log('[B2D] Injected css file:', cssUrl);
  };

  document.head.appendChild(linkElement);
}

export function injectJSFile(url, callback) {
  const s = document.createElement('script');
  s.src = url;
  s.onload = callback;
  (document.head||document.documentElement).appendChild(s);
}

export const createIconLink = ({
  className = 'icon-link',
  href = '#',
  onClick,
  title = '',
  iconDefault,
  iconOnClick,
  iconOnClickTimeout = 3000,
}) => {
  const link = document.createElement("a");
  link.classList.add(className);
  link.title = title;
  link.href = href;
  link.target = '_blank';
  link.innerHTML = `<b2d-icon name="${iconDefault}"></b2d-icon>`;

  if (isFunction(onClick)) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const eventReturn = onClick(e);

      if (iconOnClick) {
        const icon = link.querySelector('b2d-icon');
        icon.setIcon(iconOnClick);
        setTimeout(() => {
          icon.setIcon(iconDefault);
        }, iconOnClickTimeout);
      }

      return eventReturn;
    });
  }

  return link;
}
