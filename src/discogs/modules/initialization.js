'use strict';

import { click } from "../../utils/html";
import { convertNewlinesToBreaks } from "../../utils/utils";
import { setSectionHint, fillDurations, getSubmissionFormSectionNotes, selectFormatDescription, selectFormatFileType, setInputValue, getArtistNameInput, getQuantityInput, getNotesTextarea, getSubmissionNotesTextarea } from "./draft-page.js";
import { showNotificationError, showNotificationInfo } from "./notification.js";

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

  setupReadMetadataButton();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'metadata') {
      applyMetadata(request.metadata);
    }

    return true;
  });
}

function setupReadMetadataButton() {
  const readMetadataBtn = document.createElement('button');
  readMetadataBtn.classList.add('button', 'button-small', 'button-blue');
  readMetadataBtn.textContent = 'Read metadata';
  readMetadataBtn.addEventListener('click', () => {
    try {
      const metadata = getMetadataFromNotes();
      applyMetadata(metadata);
    } catch (error) {
      console.error(error);
      showNotificationError(error.message);
    }
  });

  const submissionFormSectionNotes = getSubmissionFormSectionNotes();
  submissionFormSectionNotes.append(readMetadataBtn);

  if (submissionNotesTextarea.value) {
    click(readMetadataBtn);
  }
}

function getMetadataFromNotes() {
  try {
    return JSON.parse(notesTextarea.value);
  } catch (error) {
    console.error('[B2D] Invalid JSON metadata in Notes');
    console.error(error);
    throw new Error('Invalid metadata in Notes');
  }
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
  setSectionHint({section: 'submission_notes', text: `<var>${convertNewlinesToBreaks(metadata.submissionNotes)}</var>`, title: 'Auto-generated submission notes'});
}
