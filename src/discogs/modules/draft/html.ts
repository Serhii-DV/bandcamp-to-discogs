import { FormElement, FormTextElement } from 'src/discogs/app/draft/types';
import { debug } from '../../../utils/console';

export const getArtistNameInput = (): HTMLInputElement => {
  return document.getElementById('artist-name-input') as HTMLInputElement;
};

export const getReleaseTitleInput = (): HTMLInputElement => {
  return document.getElementById('release-title-input') as HTMLInputElement;
};

export const getLabelNameInput = (): HTMLInputElement => {
  return document.getElementById('label-name-input-0') as HTMLInputElement;
};

export const getQuantityInput = (): HTMLInputElement => {
  return document.querySelector(
    'input[aria-label="Quantity of format"]'
  ) as HTMLInputElement;
};

export const getCountrySelect = (): HTMLSelectElement => {
  return document.getElementById('release-country-select') as HTMLSelectElement;
};

export const getReleasedDateInput = (): HTMLInputElement => {
  return document.getElementById('release-date') as HTMLInputElement;
};

export const getTrackTitleInputs = (): NodeListOf<HTMLInputElement> => {
  return document.querySelectorAll(
    '.track_input'
  ) as NodeListOf<HTMLInputElement>;
};

export const getAddCreditButton = (): HTMLButtonElement => {
  return document.getElementById('add-credit') as HTMLButtonElement;
};

export const getCreditsArtistNameInput = (): HTMLInputElement => {
  return document.querySelector(
    '.credit-artist-name-input'
  ) as HTMLInputElement;
};

export const getNotesTextarea = (): HTMLTextAreaElement => {
  return document.querySelector(
    'textarea#release-notes-textarea'
  ) as HTMLTextAreaElement;
};

export const getSubmissionNotesTextarea = (): HTMLTextAreaElement => {
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

export function setFormElementValue(element: FormElement, value: string): void {
  if (element instanceof HTMLSelectElement) {
    selectOptionByValue(element, value);
  } else {
    setInputValue(element, value);
  }
}

export function setInputValue(
  inputElement: FormTextElement,
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

export function checkInput(inputElement: HTMLInputElement): void {
  // if (inputElement.checked) {
  //   return;
  // }

  inputElement.focus();
  inputElement.click();
  triggerInputEvent(inputElement);
  inputElement.blur();
}

export function selectOptionByValue(
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

  debug(`Option with value "${value}" not found.`);
}

export function triggerInputEvent(element: HTMLElement): void {
  const inputEvent = new Event('input', { bubbles: true, cancelable: true });
  element.dispatchEvent(inputEvent);
}

export function triggerChangeEvent(element: HTMLElement): void {
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  element.dispatchEvent(changeEvent);
}
