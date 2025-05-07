import { MetadataValueObject } from '../../../app/metadataValue';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getLabelNameInput } from '../html';
import { setSection, setupSectionGroupHints } from '../utils';

export function setupSectionLabel(label: MetadataValueObject): void {
  const labelNameInput = getLabelNameInput();
  const target = labelNameInput;
  const labelGroup = new VariationsGroup(
    'Label',
    [labelNameInput],
    label.toArray(),
    false,
    false,
    target
  );

  setSection(
    new Section('label', 'Bandcamp page label or artist name', label.toString())
  );

  setupSectionGroupHints(labelGroup);
}
