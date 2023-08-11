'use strict';

((document) => {
  let qtyInput;
  let trackTitleInputs;
  let trackDurationInputs;
  let notesTextarea;
  let submissionNotesTextarea;

  setTimeout(() => {
    detectElements();
    // @see DiscogsCsv::fromRelease
    const releaseData = unserializeReleaseData();

    if (!isObject(releaseData)) {
      return;
    }

    updateQuantity(releaseData.format.qty);
    selectFormatFileType(releaseData.format.fileType);
    selectFormatDescription(releaseData.format.description);
    fillDurations();
    setInputValue(submissionNotesTextarea, releaseData.submissionNotes);
    setInputValue(notesTextarea, '');
  }, 2000);

  function detectElements() {
    qtyInput = document.querySelector('input[aria-label="Quantity of format"]');
    trackTitleInputs = document.querySelectorAll('.track_input');
    trackDurationInputs = document.querySelectorAll('input[aria-label="Track duration"]');
    notesTextarea = document.querySelector('textarea#release-notes-textarea');
    submissionNotesTextarea = document.querySelector('textarea#release-submission-notes-textarea');
  }

  function unserializeReleaseData() {
    const jsonString = notesTextarea.value;
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('B2D: Invalid JSON in Notes');
    }
    return null;
  }

  /**
   * @param {Number} qty
   */
  function updateQuantity(qty) {
    setInputValue(qtyInput, qty);
  }

  /**
   * @param {String} fileType
   */
  function selectFormatFileType(fileType) {
    const fileTypeInput = document.querySelector('input[value="' + fileType + '"]');

    if (fileTypeInput) {
      checkInput(fileTypeInput);
      console.log(`B2D: Format file type ${fileType} was checked`);
    } else {
      console.log(`B2D: Format file type ${fileType} not found`);
    }
  }

  /**
   * @param {String} formatDescription
   */
  function selectFormatDescription(formatDescription) {
    const descriptionInput = document.querySelector('.format_descriptions_type input[value="' + formatDescription + '"]');

    if (descriptionInput) {
      checkInput(descriptionInput);
      console.log(`B2D: Format description ${formatDescription} was checked`);
    } else {
      console.log(`B2D: Format description ${formatDescription} not found`);
    }
  }

  function fillDurations() {
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
})(document);

/**
 * @param {String} str
 * @returns {Array<String, String>}
 */
function extractTitleAndTime(str) {
  const parts = str.split(" ");

  // Check if the last part matches the time format (minutes:seconds)
  const timeFormatRegex = /^\d+:\d+$/; // Example: 7:38
  const lastPart = parts[parts.length - 1];

  if (!timeFormatRegex.test(lastPart)) {
    return [str, ''];
  }

  const timeValue = parts.pop();
  const modifiedString = parts.join(" ");

  return [modifiedString, timeValue];
}

function setInputValue(inputElement, value) {
  const oldValue = inputElement.value;
  inputElement.focus();
  inputElement.value = value;
  triggerInputEvent(inputElement);
  inputElement.blur();

  console.log(`B2D: Value changed from "${oldValue}" to "${value}"`);
}

function checkInput(inputElement) {
  inputElement.focus();
  inputElement.click();
  triggerInputEvent(inputElement);
  inputElement.blur();
}

function triggerInputEvent(element) {
  const inputEvent = new Event("input", { bubbles: true, cancelable: true });
  element.dispatchEvent(inputEvent);
}

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
