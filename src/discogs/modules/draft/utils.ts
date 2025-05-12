import { createElementFromHTML } from '../../../utils/html';
import { debug } from '../../../utils/console';
import { Section } from '../../../discogs/app/draft/section';
import { VariationsGroup } from '../../../discogs/app/draft/variationGroup';
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
  <div class="b2d-note">Use one of the auto-generated values by clicking on the button <i class="icon icon-magic" role="img" aria-hidden="true"></i></div>`;
}

/**
 * Set up hint buttons for a variation group
 * @param group Variation group to set up hints for
 */
export function setupSectionGroupHints(group: VariationsGroup): void {
  group.setupHints();
}

/**
 * Set up hint buttons for multiple variation groups
 * @param groups Array of variation groups to set up hints for
 */
export function setupSectionGroupsHints(groups: VariationsGroup[]): void {
  groups.forEach((group) => setupSectionGroupHints(group));
}
