'use strict';

import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import { click, element, elements, onClick } from '../../../utils/html';
import {
  setSection,
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
  generateHintContent
} from './utils';
import { showNotificationInfo, showNotificationWarning } from '../notification';
import { log, logError } from '../../../utils/console';
import { Metadata } from '../../app/metadata';
import { generateSelfReleasedLabel } from '../discogs';
import { FormElement } from '../../app/draft/types';
import { VariationsGroup } from '../../app/draft/variationGroup';
import { Section } from '../../app/draft/section';
import { Variation } from '../../app/draft/variation';

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

  setSection(new Section('artist', 'Bandcamp artist name', '', [artistGroup]));

  const titleGroup = new VariationsGroup(
    'Title',
    [getReleaseTitleInput()],
    [new Variation(metadata.title)]
  );

  setSection(new Section('title', 'Bandcamp release title', '', [titleGroup]));

  const labelGroup = new VariationsGroup(
    'Label',
    [getLabelNameInput()],
    [
      new Variation(metadata.label),
      new Variation(generateSelfReleasedLabel(metadata.label))
    ]
  );

  setSection(
    new Section('label', 'Bandcamp page label or artist name', '', [labelGroup])
  );

  const countryGroup = new VariationsGroup(
    'Country',
    [getCountrySelect()],
    [new Variation(metadata.country)]
  );

  setSection(new Section('country', 'Bandcamp country', '', [countryGroup]));

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

  setSection(
    new Section(
      'format',
      'Bandcamp auto-detected format',
      generateHintContent(metadata.format),
      [qtyGroup, fileTypeGroup, formatDescriptionGroup, formatFreeTextGroup]
    )
  );

  const releasedGroup = new VariationsGroup(
    'Date',
    [getReleasedDateInput()],
    [
      new Variation(metadata.released.publishedDate),
      new Variation(metadata.released.modifiedDate)
    ]
  );

  setSection(
    new Section(
      'released',
      'Bandcamp release dates',
      generateHintContent(metadata.released),
      [releasedGroup]
    )
  );

  setSection(new Section('credits', 'Bandcamp credits', metadata.credits));

  const genresGroup = new VariationsGroup(
    'Genres',
    elements('.genres input[type="checkbox"]') as HTMLInputElement[],
    metadata.genres.autoDetectedGenres.map((genre) => new Variation(genre))
  );
  const stylesGroup = new VariationsGroup(
    'Styles',
    [element('#release-styles') as HTMLSelectElement],
    metadata.genres.autoDetectedStyles.map((style) => new Variation(style))
  );

  setSection(
    new Section(
      'genres',
      'Bandcamp genres related data',
      generateHintContent(metadata.genres),
      [genresGroup]
    )
  );

  setSection(
    new Section('styles', 'Bandcamp auto generated styles', '', [stylesGroup])
  );

  const submissionNotesGroup = new VariationsGroup(
    'Submission notes',
    [getSubmissionNotesTextarea()],
    [new Variation(metadata.submissionNotes)]
  );

  setSection(
    new Section('submission_notes', 'Auto-generated submission notes', '', [
      submissionNotesGroup
    ])
  );
}
