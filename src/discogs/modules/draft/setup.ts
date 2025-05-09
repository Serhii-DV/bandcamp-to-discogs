import { chromeListenToMessage } from '../../../utils/chrome';
import { MessageType } from '../../../app/core/messageType';
import { click } from '../../../utils/html';
import { autofillDurations, setNotes } from './utils';
import { showNotificationInfo, showNotificationWarning } from '../notification';
import { debug, log, logError } from '../../../utils/console';
import { Metadata } from '../../app/metadata';
import {
  getArtistNameInput,
  getNotesTextarea,
  getSubmissionFormSectionNotes,
  getSubmissionNotesTextarea
} from './html';

// Import section setup functions
import { setupSectionArtist } from './sections/sectionArtist';
import { setupSectionTitle } from './sections/sectionTitle';
import { setupSectionLabel } from './sections/sectionLabel';
import { setupSectionCountry } from './sections/sectionCountry';
import { setupSectionFormat } from './sections/sectionFormat';
import { setupSectionReleased } from './sections/sectionReleased';
import { setupSectionCredits } from './sections/sectionCredits';
import { setupSectionGenres } from './sections/sectionGenres';
import { setupSectionStyles } from './sections/sectionStyles';
import { setupSectionSubmissionNotes } from './sections/sectionSubmissionNotes';
import { MetadataValueObject } from '../../app/metadataValue';

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

  readMetadataBtn.addEventListener('click', () => {
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

  const titleValue = new MetadataValueObject(metadata.title);
  const labelValue = new MetadataValueObject(metadata.label);
  const countryValue = new MetadataValueObject(metadata.country);

  setupSectionArtist(metadata.artist);
  setupSectionTitle(titleValue);
  setupSectionLabel(labelValue);
  setupSectionCountry(countryValue);
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
