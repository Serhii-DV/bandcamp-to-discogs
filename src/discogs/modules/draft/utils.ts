import {
  addClass,
  click,
  createElementFromHTML,
  element,
  elements,
  isCheckbox,
  onClick,
  removeClass,
  toggleClass
} from '../../../utils/html';
import { debug } from '../../../utils/console';
import { hasClass, isArray } from '../../../utils/utils';
import { truncateText } from '../../../utils/string';
import { FormElement, FormTextElement } from '../../app/draft/types';
import { Section } from 'src/discogs/app/draft/section';
import { VariationsGroup } from 'src/discogs/app/draft/variationGroup';
import { Variation } from 'src/discogs/app/draft/variation';
import {
  checkInput,
  getCountrySelect,
  getNotesTextarea,
  getQuantityInput,
  getSection,
  getSubmissionNotesTextarea,
  getTrackTitleInputs,
  selectOptionByValue,
  setInputValue
} from './html';

// General setup
const activeButtonClassName = 'button-green';
const iconMagic = `<i class="icon icon-magic" role="img" aria-hidden="true"></i>`;

/**
 * @param {String} fileType
 */
export function selectFormatFileType(fileType: string): void {
  const fileTypeInput = document.querySelector(
    'input[value="' + fileType + '"]'
  ) as HTMLInputElement;

  if (fileTypeInput) {
    checkInput(fileTypeInput);
  }

  debug(
    `Format file type ${fileType}`,
    fileTypeInput ? 'Checked' : 'Not Found'
  );
}

/**
 * @param {String} formatDescription
 */
export function selectFormatDescription(formatDescription: string): void {
  const descriptionInput = document.querySelector(
    '.format_descriptions_type input[value="' + formatDescription + '"]'
  ) as HTMLInputElement;

  if (descriptionInput) {
    checkInput(descriptionInput);
  }

  debug(
    `Format description ${formatDescription}.`,
    descriptionInput ? 'Checked' : 'Not Found'
  );
}

export function autofillDurations(): void {
  const trackTitleInputs = getTrackTitleInputs();
  const trackDurationInputs = document.querySelectorAll(
    'input[aria-label="Track duration"]'
  ) as NodeListOf<HTMLInputElement>;

  trackDurationInputs.forEach((durationInput, index) => {
    if (durationInput.value !== '') {
      return;
    }

    const trackTitleInput = trackTitleInputs[index];
    const [title, duration] = extractTitleAndTime(trackTitleInput.value);

    setInputValue(trackTitleInput, title);
    setInputValue(durationInput, duration);
  });
}

/**
 * @param {String} str
 * @returns {Array<String, String>}
 */
export function extractTitleAndTime(str: string): [string, string] {
  const parts = str.split(' ');

  const timeFormatRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}$/; // Matches hh:mm:ss or mm:ss
  const lastPart = parts[parts.length - 1];

  if (!timeFormatRegex.test(lastPart)) {
    return [str, ''];
  }

  const timeValue = parts.pop()!;
  const modifiedString = parts.join(' ');

  return [modifiedString, timeValue];
}

export function setFormat(
  qty: string,
  fileType: string,
  description: string
): void {
  const qtyInput = getQuantityInput();
  setInputValue(qtyInput, qty);
  selectFormatFileType(fileType);
  selectFormatDescription(description);
}

export function setCountry(country: string): void {
  const countrySelect = getCountrySelect();
  selectOptionByValue(countrySelect, country);
}

export function setSubmissionNotes(submissionNotes: string): void {
  const submissionNotesTextarea = getSubmissionNotesTextarea();
  setInputValue(submissionNotesTextarea, submissionNotes);
}

export function setNotes(notes: string): void {
  const notesTextarea = getNotesTextarea();
  setInputValue(notesTextarea, notes);
}

function makeVariationsHtml(
  variations: Variation[],
  selectAllBtn: boolean,
  draggable: boolean
): string {
  if (!isArray(variations)) {
    throw new Error('Variations should be an array');
  }

  if (variations.length === 0) {
    return '';
  }

  return `
<div class="b2d-variations">
  ${variations.map((variation) => makeVariationButtonHtml(variation, draggable)).join(' ')}
  ${makeClearButtonHtml()}
  ${selectAllBtn ? makeSelectAllButtonHtml() : ''}
</div>
`;
}

function makeVariationButtonHtml(
  variation: Variation,
  draggable: boolean = false
): string {
  if (!variation) {
    return '';
  }

  const icon = iconMagic;
  const value = variation.toString();
  const content = truncateText(value, 30);
  const button = createElementFromHTML(
    `<button class="b2d-variation button button-small">${icon} ${content}</button>`
  ) as HTMLButtonElement;
  button.title = value;
  button.value = value;

  if (draggable) {
    button.draggable = true;
    addClass(button, 'b2d-draggable');
  }

  return button.outerHTML;
}

function makeVariationsGroupHtml(
  group: VariationsGroup,
  showTitle: boolean = true
): string {
  return `
<div class="b2d-group ${makeVariationsGroupClass(group)}">
  ${showTitle && group.title ? `<b>${group.title}:</b>` : ''}
  ${makeVariationsHtml(group.variations, group.multiChoice, group.draggable)}
</div>
${group.draggable ? makeInfoHtml('Drag the buttons to the Name fields and drop them.') : ''}
`;
}

function makeInfoHtml(content: string): string {
  return `<div class="b2d-info">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-square" viewBox="0 0 16 16">
  <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
</svg>
${content}
</div>`;
}

export function makeVariationsGroupClass(group: VariationsGroup): string {
  return `b2d-variations-group-${group.alias}`;
}

function makeVariationsGroupsHtml(groups: VariationsGroup[]): string {
  const showTitle = groups.length > 1;
  return groups
    .map((group) => makeVariationsGroupHtml(group, showTitle))
    .join('\n');
}

function makeClearButtonHtml(): string {
  return `<button class="b2d-clear-button button button-small button-red" title="Clear the field">Clear</button>`;
}

function makeSelectAllButtonHtml(): string {
  return `<button class="b2d-select-all-button button button-small button-blue" title="Select all fields">Select All</button>`;
}

export function setSection(section: Section): void {
  debug('Setting section', section);

  const sectionElement = getSection(section.section);
  let b2dSection = sectionElement.querySelector('.b2d-section') as HTMLElement;

  if (!b2dSection) {
    b2dSection = createElementFromHTML(
      `<div class="b2d-section"></div>`
    ) as HTMLElement;
    const sectionLabel = sectionElement.querySelector('label');
    sectionLabel!.insertAdjacentElement('afterend', b2dSection);
  }

  b2dSection.innerHTML = `
  <h4>${section.title}</h4>
  <div class="b2d-content">${section.content}</div>
  ${makeVariationsGroupsHtml(section.variationsGroups)}
`;

  section.variationsGroups.forEach((group: VariationsGroup) => {
    const groupElement = getGroupElement(group, b2dSection);
    if (groupElement) {
      setupVariationsGroup(group, groupElement);
    }
  });
}

function setupVariationsGroup(
  group: VariationsGroup,
  variationsGroupElement: HTMLElement
): void {
  const buttons = getButtons(variationsGroupElement);
  const clearButton = getClearButton(variationsGroupElement);

  if (group.draggable && group.container) {
    setupDraggableButtons(group.container, buttons, clearButton);
  } else {
    setupFormElements(group.elements, buttons);

    onClick(buttons, (event) =>
      variationButtonClickHandler(
        event.target as HTMLButtonElement,
        group,
        buttons
      )
    );

    setupClearButton(group, clearButton, buttons);
  }

  if (group.multiChoice) {
    const selectAllButton = getSelectAllButton(variationsGroupElement);
    setupSelectAllButton(selectAllButton, buttons);
  }
}

function getGroupElement(
  group: VariationsGroup,
  b2dSection: HTMLElement
): HTMLElement {
  return element(
    `.${makeVariationsGroupClass(group)} .b2d-variations`,
    b2dSection
  ) as HTMLElement;
}

function getButtons(variationsGroupElement: HTMLElement): HTMLButtonElement[] {
  return elements(
    '.b2d-variation',
    variationsGroupElement
  ) as HTMLButtonElement[];
}

function getClearButton(
  variationsGroupElement: HTMLElement
): HTMLButtonElement {
  return element(
    '.b2d-clear-button',
    variationsGroupElement
  ) as HTMLButtonElement;
}

function setupClearButton(
  group: VariationsGroup,
  clearButton: HTMLButtonElement,
  buttons: HTMLButtonElement[]
): void {
  const checkboxes = getGroupCheckboxes(group);
  const hasCheckboxes = checkboxes.length > 0;

  onClick(clearButton, () => {
    if (hasCheckboxes) {
      uncheckSelectedCheckboxes(checkboxes);
      updateButtonsStateByCheckboxes(buttons, checkboxes);
      return;
    }

    clearActiveButtons(buttons);
  });
}

function getSelectAllButton(
  variationsGroupElement: HTMLElement
): HTMLButtonElement {
  return element(
    '.b2d-select-all-button',
    variationsGroupElement
  ) as HTMLButtonElement;
}

function setupSelectAllButton(
  selectAllButton: HTMLButtonElement,
  buttons: HTMLButtonElement[]
): void {
  onClick(selectAllButton, () => {
    click(getNonActiveButtons(buttons));
  });
}

function variationButtonClickHandler(
  button: HTMLButtonElement,
  group: VariationsGroup,
  buttons: HTMLButtonElement[]
): void {
  if (processCheckboxes(group, button, buttons)) return;

  const isActiveButton = isButtonActive(button);
  const value = isActiveButton ? '' : button.value;
  const elements = group.elements;

  removeButtonActiveState(buttons);
  toggleButtonActiveState(button);

  elements.forEach((element: FormElement) => {
    setFormElementValue(element, value);
  });
}

function getGroupCheckboxes(group: VariationsGroup): HTMLInputElement[] {
  return group.elements.filter(
    (element) => element instanceof HTMLInputElement && isCheckbox(element)
  ) as HTMLInputElement[];
}

function getMatchedCheckboxes(
  checkboxes: HTMLInputElement[],
  value: string
): HTMLInputElement[] {
  return checkboxes.filter((checkbox) => checkbox.value === value);
}

function getSelectedCheckboxes(
  checkboxes: HTMLInputElement[]
): HTMLInputElement[] {
  return checkboxes.filter((checkbox) => checkbox.checked);
}

function uncheckSelectedCheckboxes(checkboxes: HTMLInputElement[]): void {
  // Uncheck all checked checkboxes
  const uncheckCheckboxes = getSelectedCheckboxes(checkboxes);
  click(uncheckCheckboxes);
}

function processCheckboxes(
  group: VariationsGroup,
  button: HTMLButtonElement,
  buttons: HTMLButtonElement[]
): boolean {
  const checkboxes = getGroupCheckboxes(group);

  if (!checkboxes.length) return false;

  const { multiChoice } = group;

  if (!multiChoice && isButtonActive(button)) {
    const matchedCheckboxes = getMatchedCheckboxes(checkboxes, button.value);
    const clickCheckboxes = getSelectedCheckboxes(matchedCheckboxes);

    // Uncheck only current button checkboxes if it's active
    click(clickCheckboxes);
    updateButtonsStateByCheckboxes(buttons, checkboxes);

    return true;
  }

  if (!multiChoice) {
    // Uncheck all selected checkboxes
    const clickCheckboxes = getSelectedCheckboxes(checkboxes);
    click(clickCheckboxes);
  }

  // Click only on the checkbox that matches the button value
  const checkCheckboxes = getMatchedCheckboxes(checkboxes, button.value);
  click(checkCheckboxes);

  updateButtonsStateByCheckboxes(buttons, checkboxes);

  return true;
}

function setFormElementValue(element: FormElement, value: string): void {
  debug('Set form element value:', element, value);

  if (instanceOfFormTextElement(element)) {
    setInputValue(element, value);
  } else if (element instanceof HTMLSelectElement) {
    selectOptionByValue(element, value);
  }
}

function clearActiveButtons(buttons: HTMLButtonElement[]): void {
  click(getActiveButtons(buttons));
}

function setupFormElements(
  elements: FormElement[],
  buttons: HTMLButtonElement[]
): void {
  const getElementValue = (element: FormElement): string =>
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
      ? element.value.trim()
      : '';

  const handleButtons = (
    element: FormElement,
    buttons: HTMLButtonElement[]
  ): void => {
    const value = getElementValue(element);
    const isCheckboxElement = isCheckbox(element as HTMLInputElement);
    const isChecked = isCheckboxElement
      ? (element as HTMLInputElement).checked === true
      : false;

    if (!isCheckboxElement) removeClass(buttons, activeButtonClassName);

    buttons.forEach((button) => {
      const buttonValue = button.value;
      const shouldAddClass = isCheckboxElement
        ? isChecked && buttonValue === value
        : buttonValue === value;

      if (shouldAddClass) {
        addClass(button, activeButtonClassName);
      }
    });
  };

  elements.forEach((element) => {
    if (!element) return;

    const eventType = instanceOfFormTextElement(element) ? 'input' : 'change';

    const handleEvent = () => handleButtons(element, buttons);

    element.addEventListener(eventType, handleEvent);
    handleEvent();
  });
}

function setupDraggableButtons(
  container: HTMLElement,
  buttons: HTMLButtonElement[],
  clearButton: HTMLButtonElement
): void {
  const containerElements = (): FormTextElement[] => {
    return Array.from(container.querySelectorAll('input, textarea'));
  };

  buttons.forEach((button) => {
    button.addEventListener('dragstart', handleDragStart);
  });

  container.addEventListener('dragover', (event) => {
    if (instanceOfFormTextElement(event.target)) {
      handleDragOver(event as DragEvent);
    }
  });

  container.addEventListener('drop', (event) => {
    if (instanceOfFormTextElement(event.target)) {
      handleDrop(event as DragEvent, buttons);
      updateButtonsState(buttons, containerElements());
    }
  });

  onClick(clearButton, () => {
    const elements = containerElements();
    elements.forEach((element) => {
      setInputValue(element, '');
    });
    updateButtonsState(buttons, elements);
  });
}

function instanceOfFormTextElement(
  element?: EventTarget | null
): element is FormTextElement {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  );
}

function handleDragStart(event: DragEvent) {
  const button = event.target as HTMLButtonElement;
  event.dataTransfer?.setData('text/plain', button.value || '');
}

function handleDragOver(event: DragEvent) {
  // Prevent default to allow drop
  event.preventDefault();
}

function handleDrop(event: DragEvent, buttons: HTMLButtonElement[]): void {
  event.preventDefault();

  const data = event.dataTransfer?.getData('text/plain');
  if (!data) return;

  const target = event.target as FormTextElement;
  setInputValue(target, data);

  buttons.forEach((button) => {
    if (button.value === data) {
      setButtonInActiveState(button);
    }
  });
}

function isButtonActive(button: HTMLButtonElement): boolean {
  return hasClass(button, activeButtonClassName) as boolean;
}

function getActiveButtons(buttons: HTMLButtonElement[]): HTMLButtonElement[] {
  return buttons.filter(isButtonActive);
}

function getNonActiveButtons(
  buttons: HTMLButtonElement[]
): HTMLButtonElement[] {
  return buttons.filter((button) => !isButtonActive(button));
}

function toggleButtonActiveState(button: HTMLButtonElement): void {
  toggleClass(button, activeButtonClassName);
}

function setButtonInActiveState(button: HTMLButtonElement): void {
  addClass(button, activeButtonClassName);
}

function removeButtonActiveState(
  buttons: HTMLButtonElement | HTMLButtonElement[]
): void {
  const applyButtons = isArray(buttons)
    ? getActiveButtons(buttons as HTMLButtonElement[])
    : buttons;

  removeClass(applyButtons, activeButtonClassName);
}

function updateButtonsState(
  buttons: HTMLButtonElement[],
  elements: FormElement[]
): void {
  const verifyElements = elements.filter(instanceOfFormTextElement);
  if (!verifyElements.length) return;

  removeClass(buttons, activeButtonClassName);

  buttons.forEach((button) => {
    const hasValue = verifyElements.some(
      (element) => element.value === button.value
    );

    if (hasValue) {
      addClass(button, activeButtonClassName);
    }
  });
}

function updateButtonsStateByCheckboxes(
  buttons: HTMLButtonElement[],
  checkboxes: HTMLInputElement[]
): void {
  removeClass(buttons, activeButtonClassName);

  buttons.forEach((button) => {
    const isActive = checkboxes.some(
      (checkbox) => checkbox.checked && checkbox.value === button.value
    );

    if (isActive) {
      addClass(button, activeButtonClassName);
    }
  });
}
