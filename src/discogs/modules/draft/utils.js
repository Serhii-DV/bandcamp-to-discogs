import { createElementFromHTML } from '../../../utils/html';
import { log, logError } from '../../../utils/console';
import {
  camelCaseToReadable,
  hasOwnProperty,
  isArray,
  isObject,
  isString
} from '../../../utils/utils';
import { copyToClipboard } from '../../../utils/clipboard';

export const getArtistNameInput = () => {
  return document.getElementById('artist-name-input');
};

export const getReleaseTitleInput = () => {
  return document.getElementById('release-title-input');
};

export const getQuantityInput = () => {
  return document.querySelector('input[aria-label="Quantity of format"]');
};

export const getCountrySelect = () => {
  return document.getElementById('release-country-select');
};

export const getTrackTitleInputs = () => {
  return document.querySelectorAll('.track_input');
};

export const getNotesTextarea = () => {
  return document.querySelector('textarea#release-notes-textarea');
};

export const getSubmissionNotesTextarea = () => {
  return document.querySelector('textarea#release-submission-notes-textarea');
};

export function getSection(name) {
  const artistBlock = document.querySelector(`[data-ref-overview="${name}"]`);
  return artistBlock.parentElement;
}

export function getSubmissionFormSectionNotes() {
  return document.querySelector('#subform .notes');
}

/**
 * @param {String} fileType
 */
export function selectFormatFileType(fileType) {
  const fileTypeInput = document.querySelector(
    'input[value="' + fileType + '"]'
  );

  if (fileTypeInput) {
    checkInput(fileTypeInput);
  }

  log(`Format file type ${fileType}`, fileTypeInput ? 'Checked' : 'Not Found');
}

/**
 * @param {String} formatDescription
 */
export function selectFormatDescription(formatDescription) {
  const descriptionInput = document.querySelector(
    '.format_descriptions_type input[value="' + formatDescription + '"]'
  );

  if (descriptionInput) {
    checkInput(descriptionInput);
  }

  log(
    `Format description ${formatDescription}.`,
    descriptionInput ? 'Checked' : 'Not Found'
  );
}

export function autofillDurations() {
  const trackTitleInputs = getTrackTitleInputs();
  const trackDurationInputs = document.querySelectorAll(
    'input[aria-label="Track duration"]'
  );

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
function extractTitleAndTime(str) {
  const parts = str.split(' ');

  const timeFormatRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}$/; // Matches hh:mm:ss or mm:ss
  const lastPart = parts[parts.length - 1];

  if (!timeFormatRegex.test(lastPart)) {
    return [str, ''];
  }

  const timeValue = parts.pop();
  const modifiedString = parts.join(' ');

  return [modifiedString, timeValue];
}

export function setFormat(format) {
  const qtyInput = getQuantityInput();
  setInputValue(qtyInput, format.qty);
  selectFormatFileType(format.fileType);
  selectFormatDescription(format.description);
}

export function setCountry(country) {
  const countrySelect = getCountrySelect();
  selectOptionByValue(countrySelect, country);
}

export function setSubmissionNotes(submissionNotes) {
  const submissionNotesTextarea = getSubmissionNotesTextarea();
  setInputValue(submissionNotesTextarea, submissionNotes);
}

export function setNotes(notes) {
  const notesTextarea = getNotesTextarea();
  setInputValue(notesTextarea, notes);
}

export function setInputValue(inputElement, value) {
  const prev = inputElement.value;
  inputElement.focus();
  inputElement.value = value;
  triggerInputEvent(inputElement);
  inputElement.blur();

  const inputLabel = inputElement.getAttribute('aria-label');
  log(`"${inputLabel}" input value changed`, { prev, value });
}

function checkInput(inputElement) {
  if (inputElement.checked) {
    return;
  }

  inputElement.focus();
  inputElement.click();
  triggerInputEvent(inputElement);
  inputElement.blur();
}

function selectOptionByValue(selectElement, value) {
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

function triggerInputEvent(element) {
  const inputEvent = new Event('input', { bubbles: true, cancelable: true });
  element.dispatchEvent(inputEvent);
}

function triggerChangeEvent(element) {
  const changeEvent = new Event('change', { bubbles: true, cancelable: true });
  element.dispatchEvent(changeEvent);
}

function generateHintVariations(variations) {
  if (!isArray(variations)) {
    throw new Error('Variations should be an array');
  }

  return (
    '<div class="b2d-variations">' +
    variations.map(getVariation).join(' ') +
    '</div>'
  );
}

function getVariation(variation) {
  return variation
    ? `<button class="b2d-variation button button-small">${variation}</button>`
    : '';
}

function generateHintOriginalValue(original) {
  if (!original) {
    return '';
  }

  if (isString(original)) {
    original = getVariation(original);
  } else if (isObject(original)) {
    let textArr = [];
    for (const key in original) {
      if (hasOwnProperty(original, key)) {
        textArr.push({
          title: camelCaseToReadable(key),
          value: original[key]
        });
      }
    }
    original = textArr;
  }

  if (isArray(original)) {
    original = original
      .map((textItem) => {
        let value = isArray(textItem.value)
          ? textItem.value.join(', ')
          : textItem.value;
        return `${textItem.title}: ` + getVariation(value);
      })
      .join('<br />');
  }

  return `<div class="b2d-original">${original}</div>`;
}

export const setSectionHint = ({
  section,
  title,
  original,
  variations = ['']
}) => {
  log('Setting section hint', { section, title, original, variations });

  let content = generateHintOriginalValue(original);
  content += generateHintVariations(variations);

  const sectionElement = getSection(section);
  let sectionHint = sectionElement.querySelector('.b2d-section-hint');

  if (!sectionHint) {
    sectionHint = createElementFromHTML(`
<div class="b2d-section-hint"></div>
`);
    const sectionLabel = sectionElement.querySelector('label');
    sectionLabel.insertAdjacentElement('afterend', sectionHint);
  }

  sectionHint.innerHTML = `<h4>${title}</h4>${content}`;

  sectionHint
    .querySelector('.b2d-variation')
    .addEventListener('click', (event) => {
      const text = event.target.textContent;
      copyToClipboard(text).then(() => {
        log('Text copied: ', text);
      });
    });
};
