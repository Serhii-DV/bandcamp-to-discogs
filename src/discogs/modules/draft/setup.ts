'use strict';

import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import {
  addClass,
  click,
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
  getVariationsGroupClass,
  getSection
} from './utils';
import { showNotificationInfo, showNotificationWarning } from '../notification';
import { debug, log, logError } from '../../../utils/console';
import { Format, Metadata, MetadataValue } from '../../app/metadata';
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
  debug('Apply Metadata...', metadata);

  setupSectionArtist(metadata.artist);
  setupSectionTitle(metadata.title);
  setupSectionLabel(metadata.label);
  setupSectionCountry(metadata.country);
  setupSectionFormat(metadata.format);
  setupSectionReleased(metadata);
  setupSectionCredits(metadata);
  setupSectionGenres(metadata);
  setupSectionStyles(metadata);
  setupSectionSubmissionNotes(metadata.submissionNotes);

  autofillDurations();
  setNotes('');

  showNotificationInfo(
    `Release metadata was applied.<br>${metadata.artist} - ${metadata.title}`
  );

  autofocus();
}

function autofocus() {
  log('Autofocus...');

  const artistNameInput = getArtistNameInput();

  if (artistNameInput) {
    // Focus on artist name input
    artistNameInput.focus();
  }
}

function setupSectionArtist(artist: MetadataValue): void {
  const artistGroup = new VariationsGroup(
    'Name',
    [getArtistNameInput()],
    artist.variations
  );

  setSection(
    new Section('artist', 'Bandcamp artist name', artist.value, [artistGroup])
  );
}

function setupSectionTitle(title: MetadataValue): void {
  const titleGroup = new VariationsGroup(
    'Title',
    [getReleaseTitleInput()],
    title.variations
  );

  setSection(
    new Section('title', 'Bandcamp release title', title.value, [titleGroup])
  );
}

function setupSectionLabel(label: MetadataValue): void {
  const labelGroup = new VariationsGroup(
    'Label',
    [getLabelNameInput()],
    label.variations
  );

  setSection(
    new Section('label', 'Bandcamp page label or artist name', label.value, [
      labelGroup
    ])
  );
}

function setupSectionCountry(country: MetadataValue): void {
  const countryGroup = new VariationsGroup(
    'Country',
    [getCountrySelect()],
    country.variations
  );

  setSection(
    new Section('country', 'Bandcamp country', country.value, [countryGroup])
  );

  setCountry(country.value);
}

function setupSectionFormat(format: Format): void {
  const qtyGroup = new VariationsGroup(
    'Quantity',
    [getQuantityInput()],
    format.qty.variations
  );

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
    format.fileType.variations
  );

  const formatDescriptionGroup = new VariationsGroup(
    'Format Description',
    elements(
      'input[type="checkbox"]',
      formatDescriptionContainer
    ) as FormElement[],
    format.description.variations
  );

  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    [element('input#free-text-input-0') as HTMLInputElement],
    format.freeText.variations
  );

  setSection(
    new Section(
      'format',
      'Bandcamp auto-detected format',
      valueToHtml({
        qty: format.qty.value,
        fileType: format.fileType.value,
        description: format.description.value,
        freeText: format.freeText.value
      }),
      [qtyGroup, fileTypeGroup, formatDescriptionGroup, formatFreeTextGroup]
    )
  );

  setFormat(format.qty.value, format.fileType.value, format.description.value);
}

function setupSectionReleased(metadata: Metadata): void {
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
}

function setupSectionCredits(metadata: Metadata): void {
  setSection(new Section('credits', 'Bandcamp credits', metadata.credits));
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
    metadata.genres.autoDetectedStyles,
    true
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
    `.${getVariationsGroupClass(stylesGroup)} .b2d-variations`
  );
  if (!variationsGroupElement) return;

  const variationButtons = elements('.b2d-variation', variationsGroupElement);
  const styleSection = getSection('styles');
  const stylesButtonGroup = element('.styles ul', styleSection);

  const getStyleButtons = (): HTMLElement[] =>
    elements('button.facet-tag', stylesButtonGroup as Element);

  onClick(stylesButtonGroup, (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'UL') return;

    // Update buttons status after some time because style buttons need to be updated
    setTimeout(updateVariationButtonsState, 10);
  });

  const updateVariationButtonsState = (): void => {
    removeClass(variationButtons, 'button-green');

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
    });
  };

  const clearButton = element('.b2d-clear-button', variationsGroupElement);
  onClick(clearButton as HTMLElement, () => {
    // It re-generates styles block every time, so we just need to remove
    // the first button until there are no buttons left
    getStyleButtons().forEach(() => {
      let button = element('button.facet-tag', stylesButtonGroup as Element);
      button?.click();
    });
  });

  onClick(variationButtons, updateVariationButtonsState);
  updateVariationButtonsState();
}

function setupSectionSubmissionNotes(submissionNotes: MetadataValue): void {
  const submissionNotesGroup = new VariationsGroup(
    'Submission notes',
    [getSubmissionNotesTextarea()],
    submissionNotes.variations
  );

  setSection(
    new Section('submission_notes', 'Auto-generated submission notes', '', [
      submissionNotesGroup
    ])
  );

  setSubmissionNotes(submissionNotes.value);
}
