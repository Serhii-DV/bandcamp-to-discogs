import { log } from '../../utils/console';
import {
  camelCaseToReadable,
  hasOwnProperty,
  isArray,
  isObject
} from '../../utils/utils';

export const getArtistNameInput = () => {
  return document.getElementById('artist-name-input');
};

export const getReleaseTitleInput = () => {
  return document.getElementById('release-title-input');
};

export const getQuantityInput = () => {
  return document.querySelector('input[aria-label="Quantity of format"]');
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

export function setSubmissionNotes(submissionNotes) {
  const submissionNotesTextarea = getSubmissionNotesTextarea();
  setInputValue(submissionNotesTextarea, submissionNotes);
}

export function setNotes(notes) {
  const notesTextarea = getNotesTextarea();
  setInputValue(notesTextarea, notes);
}

export function setInputValue(inputElement, value) {
  const oldValue = inputElement.value;
  inputElement.focus();
  inputElement.value = value;
  triggerInputEvent(inputElement);
  inputElement.blur();

  log(`Value changed from "${oldValue}" to "${value}"`);
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

function triggerInputEvent(element) {
  const inputEvent = new Event('input', { bubbles: true, cancelable: true });
  element.dispatchEvent(inputEvent);
}

export const setSectionHint = ({ section, title, text }) => {
  if (!text) {
    return;
  }

  if (isObject(text)) {
    let textArr = [];
    for (const key in text) {
      if (hasOwnProperty(text, key)) {
        textArr.push({
          title: camelCaseToReadable(key),
          value: text[key]
        });
      }
    }
    text = textArr;
  }

  if (isArray(text)) {
    text = text
      .map((textItem) => {
        let value = isArray(textItem.value)
          ? textItem.value.join(', ')
          : textItem.value;
        return `${textItem.title}: <var>${value}</var>`;
      })
      .join('<br />');
  }

  const sectionElement = getSection(section);
  let sectionHint = sectionElement.querySelector('.b2d-section-hint');

  if (!sectionHint) {
    sectionHint = document.createElement('div');
    sectionHint.classList.add('b2d-section-hint');

    const sectionLabel = sectionElement.querySelector('label');
    sectionLabel.insertAdjacentElement('afterend', sectionHint);
  }

  sectionHint.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
};
