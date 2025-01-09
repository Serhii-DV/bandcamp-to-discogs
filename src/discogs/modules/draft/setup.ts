'use strict';

import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import { click, element, onClick } from '../../../utils/html';
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
  VariationsGroup
} from './utils';
import { showNotificationInfo, showNotificationWarning } from '../notification';
import { log, logError } from '../../../utils/console';
import { Metadata } from '../../app/metadata';
import { generateSelfReleasedLabel } from '../discogs';

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

  const artistGroup = new VariationsGroup('Name', getArtistNameInput(), [
    metadata.artist.original
  ]);

  setSectionHint({
    section: 'artist',
    original: metadata.artist.original,
    variations: [],
    title: 'Bandcamp artist name',
    elementToApply: getArtistNameInput(),
    variationsGroups: [artistGroup]
  });

  const titleGroup = new VariationsGroup('Title', getReleaseTitleInput(), [
    metadata.title
  ]);

  setSectionHint({
    section: 'title',
    original: metadata.title,
    variations: [],
    title: 'Bandcamp release title',
    elementToApply: getReleaseTitleInput(),
    variationsGroups: [titleGroup]
  });

  const labelGroup = new VariationsGroup('Label', getLabelNameInput(), [
    metadata.label,
    generateSelfReleasedLabel(metadata.label)
  ]);

  setSectionHint({
    section: 'label',
    original: metadata.label,
    variations: [],
    title: 'Bandcamp page label or artist name',
    elementToApply: getLabelNameInput(),
    variationsGroups: [labelGroup]
  });

  const countryGroup = new VariationsGroup('Country', getCountrySelect(), [
    metadata.country
  ]);

  setSectionHint({
    section: 'country',
    original: metadata.country,
    variations: [],
    title: 'Bandcamp country',
    elementToApply: getCountrySelect(),
    variationsGroups: [countryGroup]
  });

  const qtyInput = getQuantityInput();

  const formatTypeGroup = new VariationsGroup(
    'Format type',
    element('#release-format-select') as HTMLSelectElement,
    ['File']
  );
  const qtyGroup = new VariationsGroup('Quantity', qtyInput, [
    metadata.format.qty.toString()
  ]);

  const fileTypes = ['MP3', 'FLAC', 'WAV'];
  const fileTypeGroup = new VariationsGroup(
    'File type',
    element('.format_descriptions input[type="checkbox"]') as HTMLInputElement,
    fileTypes
  );

  setSectionHint({
    section: 'format',
    original: metadata.format,
    variations: [],
    title: 'Bandcamp auto-detected format',
    elementToApply: undefined,
    variationsGroups: [formatTypeGroup, qtyGroup, fileTypeGroup]
  });

  const releasedGroup = new VariationsGroup('Date', getReleasedDateInput(), [
    metadata.released.publishedDate,
    metadata.released.modifiedDate
  ]);

  setSectionHint({
    section: 'released',
    original: metadata.released,
    title: 'Bandcamp release dates',
    variations: [],
    elementToApply: getReleasedDateInput(),
    variationsGroups: [releasedGroup]
  });

  setSectionHint({
    section: 'credits',
    original: metadata.credits,
    variations: [metadata.credits],
    title: 'Bandcamp credits',
    elementToApply: undefined,
    variationsGroups: []
  });
  setSectionHint({
    section: 'genres',
    original: metadata.genres,
    title: 'Bandcamp genres related data',
    elementToApply: undefined,
    variationsGroups: []
  });
  setSectionHint({
    section: 'submission_notes',
    original: '',
    variations: [convertNewlinesToBreaks(metadata.submissionNotes)],
    title: 'Auto-generated submission notes',
    elementToApply: getSubmissionNotesTextarea(),
    variationsGroups: []
  });
}
