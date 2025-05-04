import { element, elements } from '../../../../utils/html';
import {
  MetadataValue,
  metadataValueAsArray,
  metadataValueAsString
} from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getSection } from '../html';
import {
  setSection,
  setupSectionGroupHints,
  setupGroupInputObserver
} from '../utils';

export function setupSectionArtist(artist: MetadataValue): void {
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
    new Section('artist', 'Bandcamp artist name', metadataValueAsString(artist))
  );

  setupSectionGroupHints(artistGroup);
  setupGroupInputObserver(artistGroup);
}
