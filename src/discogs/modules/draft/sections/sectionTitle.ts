import { MetadataValueObject } from '../../../app/metadata';
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
    false,
    false,
    titleInput
  );

  setSection(new Section('title', 'Bandcamp release title', title.toString()));

  setupSectionGroupHints(titleGroup);
}
