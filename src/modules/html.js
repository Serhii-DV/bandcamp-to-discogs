
export function hasDataAttribute(element, attributeName) {
  return element.hasAttribute(`data-${attributeName}`);
}

export function setDataAttribute(element, attributeName, attributeValue = '') {
  element.setAttribute(`data-${attributeName}`, attributeValue);
}

export function getDataAttribute(element, attributeName) {
  return element.getAttribute(`data-${attributeName}`);
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
