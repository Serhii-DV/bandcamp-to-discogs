import {
  addClass,
  click,
  createElementFromHTML,
  elements,
  getDataAttribute,
  isCheckbox,
  onClick,
  toggleClass
} from '../../../utils/html';
import { log, logError } from '../../../utils/console';
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

  log(`Format file type ${fileType}`, fileTypeInput ? 'Checked' : 'Not Found');
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

  log(
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
  log(`"${inputLabel}" input value changed`, { prev, value });
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
    log(`"${label}" select value changed`, value);
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

function generateVariations(variations: Variation[]): string {
  if (!isArray(variations)) {
    throw new Error('Variations should be an array');
  }

  if (variations.length === 0) {
    return '';
  }

  return `
<div class="b2d-variations">
  ${variations.map(generateVariation).join(' ')}
  ${getClearFieldButton()}
</div>
`;
}

function generateVariation(variation: Variation): string {
  const icon = `<i class="icon icon-magic" role="img" aria-hidden="true"></i>`;

  if (!variation) {
    return '';
  }

  const value = variation.toString();
  const content = truncateText(value, 50);

  return `<span class="b2d-variation button button-small" title="Set value:\n${value}" data-text="${value}">${icon} ${content}</span>`;
}

function generateVariationsGroup(group: VariationsGroup): string {
  return `
<div class="b2d-group ${generateVariationsGroupClass(group)}">
  ${group.title ? `<b>${group.title}:</b>` : ''}
  ${generateVariations(group.variations)}
</div>
`;
}

export function generateVariationsGroupClass(group: VariationsGroup): string {
  return `b2d-variations-group-${group.alias}`;
}

function generateVariationsGroups(groups: VariationsGroup[]): string {
  return groups.map(generateVariationsGroup).join('\n');
}

function getClearFieldButton(): string {
  return `<span class="b2d-variation b2d-clear-button button button-small button-red" title="Clear the field" data-text="">Clear</span>`;
}

export function setSection(section: Section): void {
  log('Setting section', section);

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
  ${generateVariationsGroups(section.variationsGroups)}
`;

  section.variationsGroups.forEach((group: VariationsGroup) =>
    setupVariationsGroup(group, b2dSection)
  );
}

function setupVariationsGroup(
  group: VariationsGroup,
  b2dSection: Element
): void {
  const buttons = elements(
    `.b2d-variations-group-${group.alias} .b2d-variation`,
    b2dSection
  );
  setupFormElementsListener(group.targets, buttons, 'button-green');

  onClick(buttons, (event) =>
    variationButtonClickHandler(
      event.target as HTMLButtonElement,
      group,
      buttons
    )
  );
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

  log('Apply text:', variation, ' to target elements ', targets);

  targets.forEach((element: FormElement) => {
    if (element instanceof HTMLInputElement) {
      handleInput(element);
    } else if (element instanceof HTMLTextAreaElement) {
      handleTextArea(element);
    } else if (element instanceof HTMLSelectElement) {
      handleSelect(element);
    } else {
      return;
    }

    toggleClass(buttons, 'button-green', button);
  });

  function handleInput(element: HTMLInputElement): void {
    if (isCheckbox(element)) {
      handleCheckbox(element, variation);
    } else {
      setInputValue(element, variation);
    }
  }

  function handleCheckbox(element: HTMLInputElement, variation: string): void {
    const shouldClick = element.checked !== (element.value === variation);

    if (shouldClick) {
      click(element);
    }
  }

  function handleTextArea(element: HTMLTextAreaElement): void {
    setInputValue(element, variation);
  }

  function handleSelect(element: HTMLSelectElement): void {
    selectOptionByValue(element, variation);
  }
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
