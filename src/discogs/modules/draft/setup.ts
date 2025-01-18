'use strict';

import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import { click, element, elements, onClick } from '../../../utils/html';
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
  generateHintContent,
  FormElement,
  Variation
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

  const artistGroup = new VariationsGroup(
    'Name',
    [getArtistNameInput()],
    [new Variation(metadata.artist.original)]
  );

  setSectionHint({
    section: 'artist',
    content: '',
    title: 'Bandcamp artist name',
    elementToApply: getArtistNameInput(),
    variationsGroups: [artistGroup]
  });

  const titleGroup = new VariationsGroup(
    'Title',
    [getReleaseTitleInput()],
    [new Variation(metadata.title)]
  );

  setSectionHint({
    section: 'title',
    title: 'Bandcamp release title',
    elementToApply: getReleaseTitleInput(),
    variationsGroups: [titleGroup]
  });

  const labelGroup = new VariationsGroup(
    'Label',
    [getLabelNameInput()],
    [
      new Variation(metadata.label),
      new Variation(generateSelfReleasedLabel(metadata.label))
    ]
  );

  setSectionHint({
    section: 'label',
    title: 'Bandcamp page label or artist name',
    elementToApply: getLabelNameInput(),
    variationsGroups: [labelGroup]
  });

  const countryGroup = new VariationsGroup(
    'Country',
    [getCountrySelect()],
    [new Variation(metadata.country)]
  );

  setSectionHint({
    section: 'country',
    title: 'Bandcamp country',
    elementToApply: getCountrySelect(),
    variationsGroups: [countryGroup]
  });

  const qtyInput = getQuantityInput();
  const qtyGroup = new VariationsGroup(
    'Quantity',
    [qtyInput],
    [new Variation(metadata.format.qty.toString())]
  );

  const fileTypes = [
    new Variation('FLAC'),
    new Variation('WAV'),
    new Variation('MP3')
  ];
  const formatDescriptionTypeElements = elements(
    '.format_descriptions_type_column'
  );
  const formatFileTypeContainer = formatDescriptionTypeElements[0];
  const formatDescriptionContainer = formatDescriptionTypeElements[2];

  const fileTypeGroup = new VariationsGroup(
    'File Type',
    elements(
      'input[type="checkbox"]',
      formatFileTypeContainer
    ) as HTMLInputElement[],
    fileTypes
  );

  const formatDescriptionGroup = new VariationsGroup(
    'Format Description',
    elements(
      'input[type="checkbox"]',
      formatDescriptionContainer
    ) as FormElement[],
    [new Variation(metadata.format.description)]
  );

  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    [element('input#free-text-input-0') as HTMLInputElement],
    [
      new Variation('24-bit/44.1kHz'),
      new Variation('320 kbps'),
      new Variation('128 kbps')
    ]
  );

  setSectionHint({
    section: 'format',
    content: generateHintContent(metadata.format),
    title: 'Bandcamp auto-detected format',
    elementToApply: undefined,
    variationsGroups: [
      qtyGroup,
      fileTypeGroup,
      formatDescriptionGroup,
      formatFreeTextGroup
    ]
  });

  const releasedGroup = new VariationsGroup(
    'Date',
    [getReleasedDateInput()],
    [
      new Variation(metadata.released.publishedDate),
      new Variation(metadata.released.modifiedDate)
    ]
  );

  setSectionHint({
    section: 'released',
    content: generateHintContent(metadata.released),
    title: 'Bandcamp release dates',
    elementToApply: getReleasedDateInput(),
    variationsGroups: [releasedGroup]
  });

  setSectionHint({
    section: 'credits',
    content: metadata.credits,
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
    [getSubmissionNotesTextarea()],
    [new Variation(metadata.submissionNotes)]
  );

  setSectionHint({
    section: 'submission_notes',
    title: 'Auto-generated submission notes',
    elementToApply: getSubmissionNotesTextarea(),
    variationsGroups: [submissionNotesGroup]
  });
}
