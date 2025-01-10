'use strict';

import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import { click, element, onClick } from '../../../utils/html';
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
  VariationsGroup,
  generateHintContent
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
    content: '',
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
    variations: [],
    title: 'Bandcamp country',
    elementToApply: getCountrySelect(),
    variationsGroups: [countryGroup]
  });

  const qtyInput = getQuantityInput();
  const qtyGroup = new VariationsGroup('Quantity', qtyInput, [
    metadata.format.qty.toString()
  ]);

  const fileTypes = ['FLAC', 'WAV', 'MP3'];
  const fileTypeGroup = new VariationsGroup(
    'File Type',
    element('.format_descriptions input[type="checkbox"]') as HTMLInputElement,
    fileTypes
  );

  const formatDescriptionGroup = new VariationsGroup(
    'Format Description',
    element('.format_descriptions input[type="checkbox"]') as HTMLInputElement,
    [metadata.format.description]
  );

  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    element('input#free-text-input-0') as HTMLInputElement,
    ['24-bit/44.1kHz', '320 kbps', '128 kbps']
  );

  setSectionHint({
    section: 'format',
    content: generateHintContent(metadata.format),
    variations: [],
    title: 'Bandcamp auto-detected format',
    elementToApply: undefined,
    variationsGroups: [
      qtyGroup,
      fileTypeGroup,
      formatDescriptionGroup,
      formatFreeTextGroup
    ]
  });

  const releasedGroup = new VariationsGroup('Date', getReleasedDateInput(), [
    metadata.released.publishedDate,
    metadata.released.modifiedDate
  ]);

  setSectionHint({
    section: 'released',
    content: generateHintContent(metadata.released),
    title: 'Bandcamp release dates',
    variations: [],
    elementToApply: getReleasedDateInput(),
    variationsGroups: [releasedGroup]
  });

  setSectionHint({
    section: 'credits',
    content: metadata.credits,
    variations: [],
    title: 'Bandcamp credits',
    elementToApply: undefined,
    variationsGroups: []
  });
  setSectionHint({
    section: 'genres',
    content: generateHintContent(metadata.genres),
    title: 'Bandcamp genres related data',
    elementToApply: undefined,
    variationsGroups: []
  });

  const submissionNotesGroup = new VariationsGroup(
    'Submission notes',
    getSubmissionNotesTextarea(),
    [metadata.submissionNotes]
  );

  setSectionHint({
    section: 'submission_notes',
    variations: [],
    title: 'Auto-generated submission notes',
    elementToApply: getSubmissionNotesTextarea(),
    variationsGroups: [submissionNotesGroup]
  });
}
