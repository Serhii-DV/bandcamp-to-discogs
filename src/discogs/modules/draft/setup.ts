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
  getReleaseTitleInput,
  getLabelNameInput,
  getReleasedDateInput,
  getCountrySelect,
  getQuantityInput,
  ElementVariation,
  VariationsGroup
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
      const notesTextarea = getNotesTextarea() as HTMLTextAreaElement;

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
    getSubmissionNotesTextarea() as HTMLTextAreaElement;
  if (submissionNotesTextarea.value) {
    click(readMetadataBtn);
  }
}

function applyMetadata(metadata: Metadata) {
  log('Applying metadata...', metadata);

  setMetadataHints(metadata);
  setFormat(
    metadata.format.qty.toString(),
    metadata.format.fileType,
    metadata.format.description
  );
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
    variations: [metadata.artist.original, ...metadata.artist.variations],
    title: 'Bandcamp artist name',
    elementToApply: getArtistNameInput(),
    variationGroups: []
  });
  setSectionHint({
    section: 'title',
    original: metadata.title,
    variations: [metadata.title],
    title: 'Bandcamp release title',
    elementToApply: getReleaseTitleInput(),
    variationGroups: []
  });
  setSectionHint({
    section: 'label',
    original: metadata.label,
    variations: [metadata.label],
    title: 'Bandcamp page label or artist name',
    elementToApply: getLabelNameInput(),
    variationGroups: []
  });
  setSectionHint({
    section: 'country',
    original: metadata.country,
    variations: [metadata.country],
    title: 'Bandcamp country',
    elementToApply: getCountrySelect(),
    variationGroups: []
  });

  const qtyInput = getQuantityInput();

  const formatTypeGroup = new VariationsGroup('Format type', [
    new ElementVariation('#release-format-select', 'File')
  ]);
  const qtyGroup = new VariationsGroup('Quantity', [
    new ElementVariation(qtyInput, metadata.format.qty.toString())
  ]);

  const fileTypes = ['MP3', 'FLAC', 'WAV'];
  const fileTypeVariations: ElementVariation[] = [];
  fileTypes.forEach((fileType) => {
    fileTypeVariations.push(
      new ElementVariation('input[value="' + fileType + '"]', fileType)
    );
  });
  const fileTypeGroup = new VariationsGroup('File type', fileTypeVariations);

  setSectionHint({
    section: 'format',
    original: metadata.format,
    variations: [],
    title: 'Bandcamp auto-detected format',
    elementToApply: undefined,
    variationGroups: [formatTypeGroup, qtyGroup, fileTypeGroup]
  });
  setSectionHint({
    section: 'released',
    original: metadata.released,
    title: 'Bandcamp release dates',
    variations: [
      metadata.released.publishedDate,
      metadata.released.modifiedDate
    ],
    elementToApply: getReleasedDateInput(),
    variationGroups: []
  });
  setSectionHint({
    section: 'credits',
    original: metadata.credits,
    variations: [metadata.credits],
    title: 'Bandcamp credits',
    elementToApply: undefined,
    variationGroups: []
  });
  setSectionHint({
    section: 'genres',
    original: metadata.genres,
    title: 'Bandcamp genres related data',
    elementToApply: undefined,
    variationGroups: []
  });
  setSectionHint({
    section: 'submission_notes',
    original: '',
    variations: [convertNewlinesToBreaks(metadata.submissionNotes)],
    title: 'Auto-generated submission notes',
    elementToApply: getSubmissionNotesTextarea(),
    variationGroups: []
  });
}
