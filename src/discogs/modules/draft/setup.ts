'use strict';

import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import {
  addClass,
  click,
  createElementFromHTML,
  element,
  elements,
  getDataAttribute,
  onClick,
  removeClass,
  valueToHtml
} from '../../../utils/html';
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
  generateVariationsGroupClass,
  getSection
} from './utils';
import { showNotificationInfo, showNotificationWarning } from '../notification';
import { debug, log, logError } from '../../../utils/console';
import { Metadata } from '../../app/metadata';
import { generateSelfReleasedLabel } from '../discogs';
import { FormElement } from '../../app/draft/types';
import { VariationsGroup } from '../../app/draft/variationGroup';
import { Section } from '../../app/draft/section';

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
    [metadata.artist.original]
  );

  setSection(new Section('artist', 'Bandcamp artist name', '', [artistGroup]));

  const titleGroup = new VariationsGroup(
    'Title',
    [getReleaseTitleInput()],
    [metadata.title]
  );

  setSection(new Section('title', 'Bandcamp release title', '', [titleGroup]));

  const labelGroup = new VariationsGroup(
    'Label',
    [getLabelNameInput()],
    [metadata.label, generateSelfReleasedLabel(metadata.label)]
  );

  setSection(
    new Section('label', 'Bandcamp page label or artist name', '', [labelGroup])
  );

  const countryGroup = new VariationsGroup(
    'Country',
    [getCountrySelect()],
    [metadata.country]
  );

  setSection(new Section('country', 'Bandcamp country', '', [countryGroup]));

  const qtyInput = getQuantityInput();
  const qtyGroup = new VariationsGroup(
    'Quantity',
    [qtyInput],
    [metadata.format.qty.toString()]
  );

  const fileTypes = ['FLAC', 'WAV', 'MP3'];
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
    [metadata.format.description]
  );

  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    [element('input#free-text-input-0') as HTMLInputElement],
    ['24-bit/44.1kHz', '320 kbps', '128 kbps']
  );

  setSection(
    new Section(
      'format',
      'Bandcamp auto-detected format',
      valueToHtml(metadata.format),
      [qtyGroup, fileTypeGroup, formatDescriptionGroup, formatFreeTextGroup]
    )
  );

  const releasedGroup = new VariationsGroup(
    'Date',
    [getReleasedDateInput()],
    [metadata.released.publishedDate, metadata.released.modifiedDate]
  );

  setSection(
    new Section(
      'released',
      'Bandcamp release dates',
      valueToHtml(metadata.released),
      [releasedGroup]
    )
  );

  setSection(new Section('credits', 'Bandcamp credits', metadata.credits));

  setupSectionGenres(metadata);
  setupSectionStyles(metadata);

  const submissionNotesGroup = new VariationsGroup(
    'Submission notes',
    [getSubmissionNotesTextarea()],
    [metadata.submissionNotes]
  );

  setSection(
    new Section('submission_notes', 'Auto-generated submission notes', '', [
      submissionNotesGroup
    ])
  );
}

function setupSectionGenres(metadata: Metadata): void {
  const genresGroup = new VariationsGroup(
    'Genres',
    elements('.genres input[type="checkbox"]') as HTMLInputElement[],
    metadata.genres.autoDetectedGenres
  );

  setSection(
    new Section(
      'genres',
      'Bandcamp genres related data',
      valueToHtml({ keywords: metadata.genres.keywords }),
      [genresGroup]
    )
  );
}

function setupSectionStyles(metadata: Metadata): void {
  const stylesGroup = new VariationsGroup(
    '',
    [element('#release-styles') as HTMLSelectElement],
    metadata.genres.autoDetectedStyles
  );

  setSection(
    new Section(
      'styles',
      'Bandcamp auto generated styles',
      'Styles were generated based on Bandcamp release keywords.',
      [stylesGroup]
    )
  );

  const variationsGroupElement = element(
    `.${generateVariationsGroupClass(stylesGroup)} .b2d-variations`
  );
  if (!variationsGroupElement) return;

  // Remove clear button
  const clearButtonElement = element(
    '.b2d-clear-button',
    variationsGroupElement
  );
  clearButtonElement && variationsGroupElement.removeChild(clearButtonElement);

  const variationButtons = elements('.b2d-variation', variationsGroupElement);
  const styleSection = getSection('styles');
  const stylesButtonGroup = element('.styles ul', styleSection);

  const getStyleButtons = (): HTMLElement[] =>
    elements('button.facet-tag', stylesButtonGroup as Element);

  const updateVariationButtonsState = (): void => {
    const styleButtons = getStyleButtons();
    styleButtons.forEach((styleButton) => {
      variationButtons.forEach((variationButton) => {
        if (
          getDataAttribute(variationButton, 'text') ===
          styleButton.textContent?.trim()
        ) {
          addClass(variationButton, 'button-green');
        }
      });
      onClick(styleButton, updateVariationButtonsState);
    });
  };

  // Add new clear button
  const clearButton = createElementFromHTML(
    `<span class="button button-small button-red" title="Clear the field">Clear</span>`
  );
  variationsGroupElement.appendChild(clearButton as Node);

  onClick(clearButton as HTMLElement, () => {
    // It re-generates styles block every time, so we just need to remove
    // the first button until there are no buttons left
    getStyleButtons().forEach(() => {
      let button = element('button.facet-tag', stylesButtonGroup as Element);
      button?.click();
    });

    removeClass(variationButtons, 'button-green');
  });

  const selectAllButton = createElementFromHTML(
    `<span class="button button-small button-blue" title="Select all fields">Select All</span>`
  );
  variationsGroupElement.appendChild(selectAllButton as Node);

  onClick(selectAllButton as HTMLElement, () => {
    click(variationButtons);
  });

  onClick(variationButtons, updateVariationButtonsState);
  updateVariationButtonsState(); // Initialize state
}
