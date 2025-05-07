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
    'input[type="text"]',
    inputsContainer
  ) as HTMLInputElement[];

  const artistValues = metadataValueAsArray(artist);

  // Create individual VariationsGroup for each artist input
  if (artistInputs.length > 0) {
    artistInputs.forEach((inputElement, index) => {
      // For each input, create a separate group with just that input
      const singleInputArray = [inputElement];
      // Use the corresponding artist value if available, otherwise use empty array
      const valueForThisInput =
        index < artistValues.length ? [artistValues[index]] : [];

      const artistGroup = new VariationsGroup(
        'Name',
        singleInputArray,
        valueForThisInput,
        false,
        true,
        inputElement,
        inputsContainer
      );

      setupSectionGroupHints(artistGroup);
      setupGroupInputObserver(artistGroup);
    });
  }

  setSection(
    new Section('artist', 'Bandcamp artist name', metadataValueAsString(artist))
  );
}
