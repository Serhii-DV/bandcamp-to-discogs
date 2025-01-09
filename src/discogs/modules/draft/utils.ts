import {
  createElementFromHTML,
  elements,
  getDataAttribute,
  onClick
} from '../../../utils/html';
import { log, logError } from '../../../utils/console';
import {
  camelCaseToReadable,
  convertToAlias,
  hasOwnProperty,
  isArray,
  isObject,
  isString,
  ObjectByStringKey
} from '../../../utils/utils';

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
getQuantityInput();

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
  if (inputElement.checked) {
    return;
  }

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

function generateVariations(variations: string[]): string {
  if (!isArray(variations)) {
    throw new Error('Variations should be an array');
  }

  if (variations.length === 0) {
    return '';
  }

  const variationElements = variations.map((variation: string) =>
    getVariation(variation)
  );

  return `
<div class="b2d-variations">
  ${variationElements.join(' ')}
  ${getClearFieldButton()}
</div>
`;
}

function getVariation(variation: string, className: string = ''): string {
  const icon = `<i class="icon icon-magic" role="img" aria-hidden="true"></i>`;

  return variation
    ? `<span class="b2d-variation button button-small ${className}" title="Apply value to the field" data-text="${variation}">${icon} ${variation}</span>`
    : '';
}

function generateVariationsGroup(group: VariationsGroup): string {
  return `
<div class="b2d-variations group-${group.alias}">
  ${group.title}:
  ${generateVariations(group.variations)}
  ${getClearFieldButton()}
</div>
`;
}

function generateVariationsGroups(groups: VariationsGroup[]): string {
  return groups.map(generateVariationsGroup).join('<br>');
}

function getClearFieldButton(): string {
  return `<span class="b2d-variation button button-small button-red" title="Clear the field" data-text="">Clear</span>`;
}

interface TitleValue {
  title: string;
  value: string | string[];
}
type OriginalValue =
  | string
  | { [key: string]: string }
  | TitleValue[]
  | ObjectByStringKey;

function generateHintOriginalValue(original: OriginalValue): string {
  if (!original) {
    return '';
  }

  if (isString(original)) {
    original = `<b>${original}</b>`;
  } else if (isObject(original)) {
    let textArr = [];
    for (const key in original as ObjectByStringKey) {
      if (hasOwnProperty(original as ObjectByStringKey, key)) {
        textArr.push({
          title: camelCaseToReadable(key),
          value: (original as ObjectByStringKey)[key]
        });
      }
    }
    original = textArr;
  }

  if (isArray(original)) {
    original = (original as TitleValue[])
      .map((textItem: TitleValue) => {
        let value = isArray(textItem.value)
          ? (textItem.value as string[]).join(', ')
          : textItem.value;
        return `${textItem.title}: <b>${value}</b>`;
      })
      .join('<br />');
  }

  return `<div class="b2d-original">${original}</div>`;
}

export type FormElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export class ElementVariation {
  element: FormElement | null;
  variation: string;

  constructor(element: FormElement | null, variation: string) {
    this.element = element;
    this.variation = variation;
  }
}

export class VariationsGroup {
  title: string;
  alias: string;
  element: FormElement | null;
  variations: string[];

  constructor(
    title: string,
    element: FormElement | null,
    variations: string[]
  ) {
    this.title = title;
    this.alias = convertToAlias(title);
    this.element = element;
    this.variations = variations;
  }
}

interface SectionHint {
  section: string;
  title: string;
  original: OriginalValue;
  variations?: string[];
  elementToApply?: HTMLElement | null;
  variationsGroups: VariationsGroup[];
}

export const setSectionHint = ({
  section,
  title,
  original,
  variations = [''],
  elementToApply,
  variationsGroups
}: SectionHint): void => {
  log('Setting section hint', { section, title, original, variations });

  let content = generateHintOriginalValue(original);
  content += generateVariations(variations);
  content += generateVariationsGroups(variationsGroups);

  const sectionElement = getSection(section);
  let sectionHint = sectionElement.querySelector('.b2d-section-hint');

  if (!sectionHint) {
    sectionHint = createElementFromHTML(`
<div class="b2d-section-hint"></div>
`) as HTMLElement;
    const sectionLabel = sectionElement.querySelector('label');
    sectionLabel!.insertAdjacentElement('afterend', sectionHint);
  }

  sectionHint.innerHTML = `<h4>${title}</h4>${content}`;

  if (variationsGroups.length) {
    variationsGroups.forEach((group: VariationsGroup) =>
      setupVariationsGroup(group, sectionHint)
    );
    return;
  }

  const variationButtons = Array.from(
    sectionHint.querySelectorAll('.b2d-variation')
  ) as HTMLElement[];

  if (
    elementToApply instanceof HTMLInputElement ||
    elementToApply instanceof HTMLSelectElement ||
    elementToApply instanceof HTMLTextAreaElement
  ) {
    setupFormElementListener(
      elementToApply,
      variationButtons,
      'button-green',
      'data-text'
    );
  }

  onClick(variationButtons, (event) => {
    const button = event.target as HTMLElement;
    const text = getDataAttribute(button, 'text');
    log('Apply text:', text, ' to element ', elementToApply?.id);

    if (
      elementToApply instanceof HTMLInputElement ||
      elementToApply instanceof HTMLTextAreaElement
    ) {
      setInputValue(elementToApply, text);
      toggleClass(variationButtons, 'button-green', button);
    } else if (elementToApply instanceof HTMLSelectElement) {
      selectOptionByValue(elementToApply, text);
      toggleClass(variationButtons, 'button-green', button);
    }
  });
};

function setupVariationsGroup(group: VariationsGroup, section: Element): void {
  const buttons = elements(
    `.b2d-variations.group-${group.alias} .b2d-variation`,
    section
  );

  if (group.element) {
    setupFormElementListener(
      group.element,
      buttons,
      'button-green',
      'data-text'
    );
  }

  onClick(buttons, (event) => {
    const button = event.target as HTMLElement;
    setupVariationButton(button, group, buttons);
  });
}

function setupVariationButton(
  button: HTMLElement,
  group: VariationsGroup,
  buttons: HTMLElement[]
): void {
  const text = getDataAttribute(button, 'text');
  const element = group.element;

  log('Apply text:', text, ' to element ', element);

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    setInputValue(element, text);
    toggleClass(buttons, 'button-green', button);
  } else if (element instanceof HTMLSelectElement) {
    selectOptionByValue(element, text);
    toggleClass(buttons, 'button-green', button);
  }
}

function toggleClass<T extends HTMLElement>(
  elements: T[],
  className: string,
  activeElement?: T
): void {
  elements.forEach((element) => element.classList.remove(className));
  activeElement?.classList.add(className);
}

function setupFormElementListener(
  element: FormElement,
  buttons: HTMLElement[],
  toggleClassName: string,
  dataAttr: string
): void {
  const applyButtonLogic = () => {
    const value =
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
        ? element.value.trim()
        : element.value;

    toggleClass(buttons, toggleClassName);
    buttons.forEach((button) => {
      if (button.getAttribute(dataAttr) === value) {
        button.classList.add(toggleClassName);
      }
    });
  };

  const eventType =
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
      ? 'input'
      : 'change';
  element.addEventListener(eventType, applyButtonLogic);
  applyButtonLogic();
}
