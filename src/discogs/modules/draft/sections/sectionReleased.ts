import { valueToHtml } from '../../../../utils/html';
import { Metadata } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getReleasedDateInput } from '../html';
import { setSection, setupSectionGroupHints } from '../utils';

export function setupSectionReleased(metadata: Metadata): void {
  const releasedDateInput = getReleasedDateInput();
  const target = releasedDateInput;
  const releasedGroup = new VariationsGroup(
    'Date',
    [releasedDateInput],
    [metadata.released.publishedDate, metadata.released.modifiedDate],
    target
  );

  setSection(
    new Section(
      'released',
      'Bandcamp release dates',
      valueToHtml(metadata.released)
    )
  );

  setupSectionGroupHints(releasedGroup);
}
