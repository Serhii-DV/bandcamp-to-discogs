'use strict';

import { chromeListenToMessage } from '../../utils/chrome';
import { MessageType } from '../../app/core/messageType';
import { click, onClick } from '../../utils/html';
import { convertNewlinesToBreaks } from '../../utils/utils';
import {
  setSectionHint,
  autofillDurations,
  getSubmissionFormSectionNotes,
  getArtistNameInput,
  getNotesTextarea,
  getSubmissionNotesTextarea,
  setFormat,
  setSubmissionNotes,
  setNotes
} from './draft-page.js';
import {
  showNotificationInfo,
  showNotificationWarning
} from './notification.js';
import { log, logError } from '../../utils/console';

export const initialize = () => {
  log('Initialization... (discogs/script.js)');
  setupReadMetadataButton();
  chromeListenToMessage((message) => {
    if (message.type === MessageType.Metadata) {
      applyMetadata(message.metadata);
    }
  });
};

function setupReadMetadataButton() {
  const readMetadataBtn = document.createElement('button');
  readMetadataBtn.classList.add('button', 'button-small', 'button-blue');
  readMetadataBtn.textContent = 'Read metadata';

  onClick(readMetadataBtn, () => {
    try {
      const metadata = getMetadataFromNotes();
      applyMetadata(metadata);
    } catch (error) {
      logError(error);
      showNotificationWarning(error.message);
    }
  });

  const submissionFormSectionNotes = getSubmissionFormSectionNotes();
  submissionFormSectionNotes.append(readMetadataBtn);

  const submissionNotesTextarea = getSubmissionNotesTextarea();
  if (submissionNotesTextarea.value) {
    click(readMetadataBtn);
  }
}

/**
 * @return {Metadata} metadata
 */
function getMetadataFromNotes() {
  try {
    const notesTextarea = getNotesTextarea();
    return JSON.parse(notesTextarea.value);
  } catch (error) {
    logError('Invalid JSON metadata in Notes', error);
    throw new Error('Invalid metadata in Notes');
  }
}

/**
 * @param {Metadata} metadata
 */
function applyMetadata(metadata) {
  setMetadataHints(metadata);
  setFormat(metadata.format);
  autofillDurations();
  setSubmissionNotes(metadata.submissionNotes);
  setNotes('');

  showNotificationInfo(
    `Release metadata was applied.<br>${metadata.artist} - ${metadata.title}`
  );

  autofocus();
}

function autofocus() {
  const artistNameInput = getArtistNameInput();

  if (artistNameInput) {
    // Focus on artist name input
    artistNameInput.focus();
  }
}

function setMetadataHints(metadata) {
  setSectionHint({
    section: 'artist',
    text: `<var>${metadata.artist}</var>`,
    title: 'Bandcamp artist name'
  });
  setSectionHint({
    section: 'title',
    text: `<var>${metadata.title}</var>`,
    title: 'Bandcamp release title'
  });
  setSectionHint({
    section: 'label',
    text: `<var>${metadata.label}</var>`,
    title: 'Bandcamp page label or artist name'
  });
  setSectionHint({
    section: 'country',
    text: metadata.country,
    title: 'Bandcamp country'
  });
  setSectionHint({
    section: 'format',
    text: metadata.format,
    title: 'Bandcamp auto-detected format'
  });
  setSectionHint({
    section: 'released',
    text: metadata.released,
    title: 'Bandcamp release dates'
  });
  setSectionHint({
    section: 'credits',
    text: metadata.credits,
    title: 'Bandcamp credits'
  });
  setSectionHint({
    section: 'genres',
    text: metadata.genres,
    title: 'Bandcamp genres related data'
  });
  setSectionHint({
    section: 'submission_notes',
    text: `<var>${convertNewlinesToBreaks(metadata.submissionNotes)}</var>`,
    title: 'Auto-generated submission notes'
  });
}
