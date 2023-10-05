import { isArray, isString } from "./utils.js";

export function hasDataAttribute(element, attributeName) {
  return element.hasAttribute(`data-${attributeName}`);
}

export function setDataAttribute(element, attributeName, attributeValue = '') {
  element.setAttribute(`data-${attributeName}`, attributeValue);
}

export function getDataAttribute(element, attributeName) {
  return element.getAttribute(`data-${attributeName}`);
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
