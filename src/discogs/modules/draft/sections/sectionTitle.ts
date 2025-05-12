import { MetadataValueObject } from '../../../app/metadataValue';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getReleaseTitleInput } from '../html';
import { setSection, setupSectionGroupHints } from '../utils';

export function setupSectionTitle(title: MetadataValueObject): void {
  const titleInput = getReleaseTitleInput();
  const titleGroup = new VariationsGroup(
    'Title',
    [titleInput],
    title.toArray(),
    titleInput
  );

  setSection(new Section('title', 'Bandcamp release title', title.toString()));

  setupSectionGroupHints(titleGroup);
}
