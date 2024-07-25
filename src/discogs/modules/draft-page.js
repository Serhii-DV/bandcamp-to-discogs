export function getArtistNameInput() {
  return document.getElementById('artist-name-input');
}

export function getReleaseTitleInput() {
  return document.getElementById('release-title-input');
}

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
export function selectFormatDescription(formatDescription) {
  const descriptionInput = document.querySelector('.format_descriptions_type input[value="' + formatDescription + '"]');

  if (descriptionInput) {
    checkInput(descriptionInput);
    console.log(`B2D: Format description ${formatDescription} was checked`);
  } else {
    console.log(`B2D: Format description ${formatDescription} not found`);
  }
}

export function fillDurations() {
  const trackDurationInputs = document.querySelectorAll('input[aria-label="Track duration"]');

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

export function setInputValue(inputElement, value) {
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

export const setSectionHint = (section, text, title) => {
  if (!text) {
    return;
  }

  const sectionElement = getSection(section);
  let sectionHint = sectionElement.querySelector('.b2d-section-hint');

  if (!sectionHint) {
    sectionHint = document.createElement("div");
    sectionHint.classList.add("b2d-section-hint");

    const sectionLabel = sectionElement.querySelector("label");
    sectionLabel.insertAdjacentElement('afterend', sectionHint);
  }

  sectionHint.innerHTML = `<h4>${title}</h4><p>${text}</p>`;
}
