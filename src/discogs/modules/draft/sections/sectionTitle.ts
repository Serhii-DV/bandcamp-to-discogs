import {
  MetadataValue,
  metadataValueAsArray,
  metadataValueAsString
} from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getReleaseTitleInput } from '../html';
import { setSection, setupSectionGroupHints } from '../utils';

export function setupSectionTitle(title: MetadataValue): void {
  const titleInput = getReleaseTitleInput();
  const titleGroup = new VariationsGroup(
    'Title',
    [titleInput],
    metadataValueAsArray(title),
    false,
    false,
    titleInput
  );

  setSection(
    new Section('title', 'Bandcamp release title', metadataValueAsString(title))
  );

  setupSectionGroupHints(titleGroup);
}
