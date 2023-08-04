'use strict';

((document) => {
  let qtyInput;
  let trackNumInputs;
  let trackTitleInputs;
  let trackDurationInputs;

  setTimeout(() => {
    detectElements();
    updateQuantity(trackNumInputs.length);
    selectFormatFileType('FLAC');
    selectFormatDescription('Album');
    fillDurations();
  }, 2000);

  function detectElements() {
    qtyInput = document.querySelector('input[aria-label="Quantity of format"]');
    trackNumInputs = document.querySelectorAll('.track-number-input');
    trackTitleInputs = document.querySelectorAll('.track_input');
    trackDurationInputs = document.querySelectorAll('input[aria-label="Track duration"]');
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
