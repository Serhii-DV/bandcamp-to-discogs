'use strict';

import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import { click, onClick } from '../../../utils/html';
import { convertNewlinesToBreaks } from '../../../utils/utils';
import {
  setSectionHint,
  autofillDurations,
  getSubmissionFormSectionNotes,
  getArtistNameInput,
  getNotesTextarea,
  getSubmissionNotesTextarea,
  setFormat,
  setSubmissionNotes,
  setNotes,
  setCountry,
  getReleaseTitleInput
} from './utils';
import { showNotificationInfo, showNotificationWarning } from '../notification';
import { log, logError } from '../../../utils/console';
import { Metadata } from '../../app/metadata';

export const setupDraftPage = () => {
  log('Setup draft page... (src/discogs/modules/draft/setup.ts)');
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
      const notesTextarea = getNotesTextarea() as HTMLInputElement;

      if (!notesTextarea.value) {
        showNotificationWarning('No Metadata in Notes');
        return;
      }

      const metadata: Metadata = JSON.parse(notesTextarea.value);
      applyMetadata(metadata);
    } catch (error) {
      showNotificationWarning('Invalid Metadata in Notes');
      logError(error);
    }
  });

  const submissionFormSectionNotes = getSubmissionFormSectionNotes();
  submissionFormSectionNotes?.append(readMetadataBtn);

  const submissionNotesTextarea =
    getSubmissionNotesTextarea() as HTMLInputElement;
  if (submissionNotesTextarea.value) {
    click(readMetadataBtn);
  }
}

function applyMetadata(metadata: Metadata) {
  log('Applying metadata...', metadata);

  setMetadataHints(metadata);
  setFormat(metadata.format);
  setCountry(metadata.country);
  autofillDurations();
  setSubmissionNotes(metadata.submissionNotes);
  setNotes('');

  showNotificationInfo(
    `Release metadata was applied.<br>${metadata.artist} - ${metadata.title}`
  );

  autofocus();
}

function autofocus() {
  log('Autofocusing...');

  const artistNameInput = getArtistNameInput();

  if (artistNameInput) {
    // Focus on artist name input
    artistNameInput.focus();
  }
}

function setMetadataHints(metadata: Metadata) {
  log('Setting metadata hints...');

  setSectionHint({
    section: 'artist',
    original: metadata.artist.original,
    variations: metadata.artist.variations,
    title: 'Bandcamp artist name',
    elementToApply: getArtistNameInput()
  });
  setSectionHint({
    section: 'title',
    original: metadata.title,
    title: 'Bandcamp release title',
    elementToApply: getReleaseTitleInput()
  });
  setSectionHint({
    section: 'label',
    original: metadata.label,
    title: 'Bandcamp page label or artist name',
    elementToApply: undefined
  });
  setSectionHint({
    section: 'country',
    original: metadata.country,
    title: 'Bandcamp country',
    elementToApply: undefined
  });
  setSectionHint({
    section: 'format',
    original: metadata.format,
    title: 'Bandcamp auto-detected format',
    elementToApply: undefined
  });
  setSectionHint({
    section: 'released',
    original: metadata.released,
    title: 'Bandcamp release dates',
    elementToApply: undefined
  });
  setSectionHint({
    section: 'credits',
    original: metadata.credits,
    title: 'Bandcamp credits',
    elementToApply: undefined
  });
  setSectionHint({
    section: 'genres',
    original: metadata.genres,
    title: 'Bandcamp genres related data',
    elementToApply: undefined
  });
  setSectionHint({
    section: 'submission_notes',
    original: '',
    variations: [convertNewlinesToBreaks(metadata.submissionNotes)],
    title: 'Auto-generated submission notes',
    elementToApply: getSubmissionNotesTextarea()
  });
}
