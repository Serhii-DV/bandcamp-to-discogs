'use strict';

import { chromeListenMessage } from "../../modules/chrome.js";
import { click } from "../../modules/html.js";
import { isObject } from "../../modules/utils.js";
import { setSectionHint, fillDurations, getSubmissionFormSectionNotes, selectFormatDescription, selectFormatFileType, setInputValue, getArtistNameInput, getQuantityInput, getNotesTextarea, getSubmissionNotesTextarea } from "./draft-page.js";
import { showNotificationInfo, showNotificationWarning } from "./notification.js";

let artistNameInput;
let qtyInput;
let notesTextarea;
let submissionNotesTextarea;

export const initialize = () => {
  console.log('[B2D] Initialization... (discogs/script.js)');

  // Detect elements
  artistNameInput = getArtistNameInput();
  qtyInput = getQuantityInput();
  notesTextarea = getNotesTextarea();
  submissionNotesTextarea = getSubmissionNotesTextarea();

  setupApplyMetadataButton();

  chromeListenMessage((request, sender, sendResponse) => {
    if (request.type === 'metadata') {
      applyMetadata(request.metadata);
    }

    return true;
  });
}

function setupApplyMetadataButton() {
  const applyBtn = document.createElement('button');
  applyBtn.classList.add('button', 'button-small', 'button-blue');
  applyBtn.textContent = 'Apply metadata';
  applyBtn.addEventListener('click', () => {
    const metadata = deserializeMetadata();

    if (!isObject(metadata)) {
      showNotificationWarning('Release metadata was not found');
      return;
    }

    applyMetadata(metadata);
  });

  const submissionFormSectionNotes = getSubmissionFormSectionNotes();
  submissionFormSectionNotes.append(applyBtn);

  if (submissionNotesTextarea.value) {
    click(applyBtn);
  }
}

function deserializeMetadata() {
  const jsonString = notesTextarea.value;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('B2D: Invalid JSON in Notes');
  }
  return null;
}

function applyMetadata(metadata) {
  setMetadataHints(metadata);
  updateQuantity(metadata.format.qty);
  selectFormatFileType(metadata.format.fileType);
  selectFormatDescription(metadata.format.description);
  fillDurations();
  setInputValue(submissionNotesTextarea, metadata.submissionNotes);
  setInputValue(notesTextarea, '');
  showNotificationInfo(`Release metadata was applied.<br>${metadata.artist} - ${metadata.title}`);

  if (artistNameInput) {
    // Focus on artist name input
    artistNameInput.focus();
  }
}

/**
 * @param {Number} qty
 */
function updateQuantity(qty) {
  setInputValue(qtyInput, qty);
}

function setMetadataHints(metadata) {
  setSectionHint({section: 'artist', text: `<var>${metadata.artist}</var>`, title: 'Bandcamp artist name'});
  setSectionHint({section: 'title', text: `<var>${metadata.title}</var>`, title: 'Bandcamp release title'});
  setSectionHint({section: 'label', text: `<var>${metadata.label}</var>`, title: 'Bandcamp page label or artist name'});
  setSectionHint({section: 'country', text: metadata.country, title: 'Bandcamp country'});
  setSectionHint({section: 'format', text: metadata.format, title: 'Bandcamp auto-detected format'});
  setSectionHint({section: 'released', text: metadata.released, title: 'Bandcamp release dates'});
  setSectionHint({section: 'credits', text: metadata.credits, title: 'Bandcamp credits'});
  setSectionHint({section: 'genres', text: metadata.genres, title: 'Bandcamp genres related data'});
}
