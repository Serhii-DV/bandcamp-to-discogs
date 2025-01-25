import {
  addClass,
  click,
  createElementFromHTML,
  element,
  elements,
  getDataAttribute,
  isCheckbox,
  onClick,
  removeClass,
  toggleClass
} from '../../../utils/html';
import { debug, logError } from '../../../utils/console';
import { hasClass, isArray } from '../../../utils/utils';
import { truncateText } from '../../../utils/string';
import { FormElement } from '../../app/draft/types';
import { Section } from 'src/discogs/app/draft/section';
import { VariationsGroup } from 'src/discogs/app/draft/variationGroup';
import { Variation } from 'src/discogs/app/draft/variation';

export const getArtistNameInput = (): HTMLInputElement | null => {
  return document.getElementById('artist-name-input') as HTMLInputElement;
};

export const getReleaseTitleInput = (): HTMLInputElement | null => {
  return document.getElementById('release-title-input') as HTMLInputElement;
};

export const getLabelNameInput = (): HTMLInputElement | null => {
  return document.getElementById('label-name-input-0') as HTMLInputElement;
};

export const getQuantityInput = (): HTMLInputElement | null => {
  return document.querySelector(
    'input[aria-label="Quantity of format"]'
  ) as HTMLInputElement;
};

export const getCountrySelect = (): HTMLSelectElement | null => {
  return document.getElementById('release-country-select') as HTMLSelectElement;
};

export const getReleasedDateInput = (): HTMLInputElement | null => {
  return document.getElementById('release-date') as HTMLInputElement;
};

export const getTrackTitleInputs = (): NodeListOf<HTMLInputElement> => {
  return document.querySelectorAll(
    '.track_input'
  ) as NodeListOf<HTMLInputElement>;
};

export const getNotesTextarea = (): HTMLTextAreaElement | null => {
  return document.querySelector(
    'textarea#release-notes-textarea'
  ) as HTMLTextAreaElement;
};

export const getSubmissionNotesTextarea = (): HTMLTextAreaElement | null => {
  return document.querySelector(
    'textarea#release-submission-notes-textarea'
  ) as HTMLTextAreaElement;
};

export function getSection(name: string): HTMLElement {
  const artistBlock = document.querySelector(`[data-ref-overview="${name}"]`);
  return artistBlock!.parentElement as HTMLElement;
}

export function getSubmissionFormSectionNotes(): HTMLElement | null {
  return document.querySelector('#subform .notes');
}

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
function extractTitleAndTime(str: string): [string, string] {
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
  const qtyInput = getQuantityInput() as HTMLInputElement;
  setInputValue(qtyInput, qty);
  selectFormatFileType(fileType);
  selectFormatDescription(description);
}

export function setCountry(country: string): void {
  const countrySelect = getCountrySelect();
  selectOptionByValue(countrySelect, country);
}

export function setSubmissionNotes(submissionNotes: string): void {
  const submissionNotesTextarea =
    getSubmissionNotesTextarea() as HTMLTextAreaElement;
  setInputValue(submissionNotesTextarea, submissionNotes);
}

export function setNotes(notes: string): void {
  const notesTextarea = getNotesTextarea() as HTMLTextAreaElement;
  setInputValue(notesTextarea, notes);
}

export function setInputValue(
  inputElement: HTMLInputElement | HTMLTextAreaElement,
  value: string
): void {
  const prev = inputElement.value;
  inputElement.focus();
  inputElement.value = value;
  triggerInputEvent(inputElement);
  inputElement.blur();

  const inputLabel = inputElement.getAttribute('aria-label');
  debug(`"${inputLabel}" input value changed`, { prev, value });
}

function checkInput(inputElement: HTMLInputElement): void {
  // if (inputElement.checked) {
  //   return;
  // }

  inputElement.focus();
  inputElement.click();
  triggerInputEvent(inputElement);
  inputElement.blur();
}

function selectOptionByValue(
  selectElement: HTMLSelectElement | null,
  value: string
): void {
  if (!selectElement || !(selectElement instanceof HTMLSelectElement)) {
    throw new Error('The first argument must be a valid <select> element.');
  }

  const option = Array.from(selectElement.options).find(
    (opt) => opt.value === value
  );

  if (option) {
    selectElement.value = value;
    triggerChangeEvent(selectElement);
    selectElement.blur();
    const label = selectElement.getAttribute('aria-label');
    debug(`"${label}" select value changed`, value);
    return;
  }

  logError(`Option with value "${value}" not found.`);
}

function triggerInputEvent(element: HTMLElement): void {
  const inputEvent = new Event('input', { bubbles: true, cancelable: true });
  element.dispatchEvent(inputEvent);
}

function triggerChangeEvent(element: HTMLElement): void {
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  element.dispatchEvent(changeEvent);
}

function getVariationsHtml(
  variations: Variation[],
  selectAllBtn: boolean
): string {
  if (!isArray(variations)) {
    throw new Error('Variations should be an array');
  }

  if (variations.length === 0) {
    return '';
  }

  return `
<div class="b2d-variations">
  ${variations.map(getVariationHtml).join(' ')}
  ${getClearButtonHtml()}
  ${selectAllBtn ? getSelectAllButtonHtml() : ''}
</div>
`;
}

function getVariationHtml(variation: Variation): string {
  const icon = `<i class="icon icon-magic" role="img" aria-hidden="true"></i>`;

  if (!variation) {
    return '';
  }

  const value = variation.toString();
  const content = truncateText(value, 30);

  return `<span class="b2d-variation button button-small" title="${value}" data-text="${value}">${icon} ${content}</span>`;
}

function getVariationsGroupHtml(
  group: VariationsGroup,
  showTitle: boolean = true
): string {
  return `
<div class="b2d-group ${getVariationsGroupClass(group)}">
  ${showTitle && group.title ? `<b>${group.title}:</b>` : ''}
  ${getVariationsHtml(group.variations, group.allowSelectAll)}
</div>
`;
}

export function getVariationsGroupClass(group: VariationsGroup): string {
  return `b2d-variations-group-${group.alias}`;
}

function getVariationsGroupsHtml(groups: VariationsGroup[]): string {
  const showTitle = groups.length > 1;
  return groups
    .map((group) => getVariationsGroupHtml(group, showTitle))
    .join('\n');
}

function getClearButtonHtml(): string {
  return `<span class="b2d-clear-button button button-small button-red" title="Clear the field" data-text="">Clear</span>`;
}

function getSelectAllButtonHtml(): string {
  return `<span class="b2d-select-all-button button button-small button-blue" title="Select all fields">Select All</span>`;
}

export function setSection(section: Section): void {
  debug('Setting section', section);

  const sectionElement = getSection(section.section);
  let b2dSection = sectionElement.querySelector('.b2d-section');

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
  ${getVariationsGroupsHtml(section.variationsGroups)}
`;

  section.variationsGroups.forEach((group: VariationsGroup) =>
    setupVariationsGroup(group, b2dSection)
  );
}

function setupVariationsGroup(
  group: VariationsGroup,
  b2dSection: Element
): void {
  const variationsGroupElement = element(
    `.${getVariationsGroupClass(group)} .b2d-variations`,
    b2dSection
  );
  if (!variationsGroupElement) return;

  const buttons = elements('.b2d-variation', variationsGroupElement);
  setupFormElementsListener(group.targets, buttons, 'button-green');

  onClick(buttons, (event) =>
    variationButtonClickHandler(
      event.target as HTMLButtonElement,
      group,
      buttons
    )
  );

  const clearButton = element('.b2d-clear-button', variationsGroupElement);
  onClick(clearButton as HTMLElement, () => {
    clearButtonClickHandler(group, buttons);
  });

  const selectAllButton = element(
    '.b2d-select-all-button',
    variationsGroupElement
  );
  onClick(selectAllButton as HTMLElement, () => {
    click(buttons);
  });
}

function variationButtonClickHandler(
  button: HTMLButtonElement,
  group: VariationsGroup,
  buttons: HTMLElement[]
): void {
  // Do nothing if the button is already green
  if (hasClass(button, 'button-green')) return;

  const variation = getDataAttribute(button, 'text');
  const targets = group.targets;

  debug('Set variation to form elements:', variation, targets);

  targets.forEach((element: FormElement) => {
    if (setFormElementVariation(element, variation)) {
      toggleClass(buttons, 'button-green', button);
    }
  });
}

function setFormElementVariation(
  element: FormElement,
  variation: string
): boolean {
  if (element instanceof HTMLInputElement && isCheckbox(element)) {
    const shouldClick = element.checked !== (element.value === variation);

    if (shouldClick) {
      click(element);
    }
  } else if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    setInputValue(element, variation);
  } else if (element instanceof HTMLSelectElement) {
    selectOptionByValue(element, variation);
  } else {
    return false;
  }

  return true;
}

function clearButtonClickHandler(
  group: VariationsGroup,
  buttons: HTMLElement[]
): void {
  const targets = group.targets;

  debug('Clear form elements:', targets);

  targets.forEach((element: FormElement) => {
    setFormElementVariation(element, '');
  });

  removeClass(buttons, 'button-green');
}

function setupFormElementsListener(
  targets: FormElement[],
  buttons: HTMLElement[],
  toggleClassName: string
): void {
  const getElementValue = (target: FormElement): string =>
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
      ? target.value.trim()
      : '';

  const handleButtons = (target: FormElement, buttons: HTMLElement[]): void => {
    const value = getElementValue(target);
    const isCheckboxTarget = isCheckbox(target as HTMLInputElement);
    const isChecked = isCheckboxTarget
      ? (target as HTMLInputElement).checked === true
      : false;

    if (!isCheckboxTarget) {
      toggleClass(buttons, toggleClassName);
    }

    buttons.forEach((button) => {
      const buttonValue = getDataAttribute(button, 'text');
      const shouldAddClass = isCheckboxTarget
        ? isChecked && buttonValue === value
        : buttonValue === value;

      if (shouldAddClass) {
        addClass(button, toggleClassName);
      }
    });
  };

  targets.forEach((target) => {
    if (!target) return;

    const eventType =
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
        ? 'input'
        : 'change';

    const handleEvent = () => handleButtons(target, buttons);

    target.addEventListener(eventType, handleEvent);
    handleEvent();
  });
}
