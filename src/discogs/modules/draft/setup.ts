import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import {
  addClass,
  click,
  element,
  elements,
  onClick,
  removeClass,
  valueToHtml
} from '../../../utils/html';
import {
  setSection,
  autofillDurations,
  setFormat,
  setSubmissionNotes,
  setNotes,
  setCountry,
  makeVariationsGroupClass
} from './utils';
import { showNotificationInfo, showNotificationWarning } from '../notification';
import { debug, log, logError } from '../../../utils/console';
import {
  Format,
  Metadata,
  MetadataValue,
  metadataValueAsArray,
  metadataValueAsString
} from '../../app/metadata';
import { FormElement } from '../../app/draft/types';
import { VariationsGroup } from '../../app/draft/variationGroup';
import { Section } from '../../app/draft/section';
import {
  getAddCreditButton,
  getArtistNameInput,
  getCountrySelect,
  getLabelNameInput,
  getNotesTextarea,
  getQuantityInput,
  getReleasedDateInput,
  getReleaseTitleInput,
  getSection,
  getSubmissionFormSectionNotes,
  getSubmissionNotesTextarea
} from './html';

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
      const notesTextarea = getNotesTextarea();

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

  const submissionNotesTextarea = getSubmissionNotesTextarea();
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
  const artistSection = getSection('artist');
  const inputsContainer = element('.drag-drop-list', artistSection);
  const artistInputs = elements(
    '.drag-drop-list input[type="text"]',
    artistSection
  ) as HTMLInputElement[];
  const artistGroup = new VariationsGroup(
    'Name',
    artistInputs,
    metadataValueAsArray(artist),
    false,
    true,
    inputsContainer
  );

  setSection(
    new Section(
      'artist',
      'Bandcamp artist name',
      metadataValueAsString(artist),
      [artistGroup]
    )
  );
}

function setupSectionTitle(title: MetadataValue): void {
  const titleGroup = new VariationsGroup(
    'Title',
    [getReleaseTitleInput()],
    metadataValueAsArray(title)
  );

  setSection(
    new Section(
      'title',
      'Bandcamp release title',
      metadataValueAsString(title),
      [titleGroup]
    )
  );
}

function setupSectionLabel(label: MetadataValue): void {
  const labelGroup = new VariationsGroup(
    'Label',
    [getLabelNameInput()],
    metadataValueAsArray(label)
  );

  setSection(
    new Section(
      'label',
      'Bandcamp page label or artist name',
      metadataValueAsString(label),
      [labelGroup]
    )
  );
}

function setupSectionCountry(country: MetadataValue): void {
  const countryGroup = new VariationsGroup(
    'Country',
    [getCountrySelect()],
    metadataValueAsArray(country)
  );
  const countryValue = metadataValueAsString(country);

  setSection(
    new Section('country', 'Bandcamp country', countryValue, [countryGroup])
  );

  setCountry(countryValue);
}

function setupSectionFormat(format: Format): void {
  const qtyGroup = new VariationsGroup(
    'Quantity',
    [getQuantityInput()],
    metadataValueAsArray(format.qty)
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
    metadataValueAsArray(format.fileType)
  );

  const formatDescriptionGroup = new VariationsGroup(
    'Format Description',
    elements(
      'input[type="checkbox"]',
      formatDescriptionContainer
    ) as FormElement[],
    metadataValueAsArray(format.description)
  );

  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    [element('input#free-text-input-0') as HTMLInputElement],
    metadataValueAsArray(format.freeText)
  );

  const qtyValue = metadataValueAsString(format.qty);
  const fileTypeValue = metadataValueAsString(format.fileType);
  const descriptionValue = metadataValueAsString(format.description);
  const freeTextValue = metadataValueAsString(format.freeText);

  setSection(
    new Section(
      'format',
      'Bandcamp auto-detected format',
      valueToHtml({
        qty: qtyValue,
        fileType: fileTypeValue,
        description: descriptionValue,
        freeText: freeTextValue
      }),
      [qtyGroup, fileTypeGroup, formatDescriptionGroup, formatFreeTextGroup]
    )
  );

  setFormat(qtyValue, fileTypeValue, descriptionValue);
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
  const addCreditBtn = getAddCreditButton();
  const section = getSection('credits');
  const inputsContainer = element('.drag-drop-list', section);
  const groups: VariationsGroup[] = [];

  metadata.credits.items.forEach((credit, index) => {
    const artistNameInputs = elements(
      '#artist-name-credits-input-' + index,
      inputsContainer
    ) as HTMLInputElement[];
    const artistListItem = element(
      "li[data-path*='" + index + "'] .drag_drop_content",
      inputsContainer
    );
    const artistRoleInputs = elements(
      '#add-role-input-' + index,
      inputsContainer
    ) as HTMLInputElement[];

    if (artistNameInputs.length === 0) {
      click(addCreditBtn);
    }

    const artist = credit.artist.join(', ');
    const artistGroup = new VariationsGroup(
      artist,
      artistRoleInputs,
      [credit.roles.join(', ')],
      false,
      true,
      inputsContainer
    );
    artistGroup.parent = artistListItem;

    const artistRolesGroup = new VariationsGroup(
      `Artist (${credit.artist.join(', ')})`,
      artistNameInputs,
      credit.artist,
      false,
      true,
      inputsContainer
    );
    artistRolesGroup.parent = artistListItem;

    groups.push(artistGroup);
    groups.push(artistRolesGroup);
  });

  setSection(
    new Section('credits', 'Bandcamp credits', metadata.credits.text, groups)
  );
}

function setupSectionGenres(metadata: Metadata): void {
  const genresGroup = new VariationsGroup(
    'Genres',
    elements('.genres input[type="checkbox"]') as HTMLInputElement[],
    metadata.genres.autoDetectedGenres,
    true
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
    `.${makeVariationsGroupClass(stylesGroup)} .b2d-variations`
  );
  if (!variationsGroupElement) return;

  const variationButtons = elements(
    '.b2d-variation',
    variationsGroupElement
  ) as HTMLButtonElement[];
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
        if (variationButton.value === styleButton.textContent?.trim()) {
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
    metadataValueAsArray(submissionNotes)
  );

  setSection(
    new Section('submission_notes', 'Auto-generated submission notes', '', [
      submissionNotesGroup
    ])
  );

  setSubmissionNotes(metadataValueAsString(submissionNotes));
}
