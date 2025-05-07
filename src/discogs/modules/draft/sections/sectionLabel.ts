import {
  MetadataValue,
  metadataValueAsArray,
  metadataValueAsString
} from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getLabelNameInput } from '../html';
import { setSection, setupSectionGroupHints } from '../utils';

export function setupSectionLabel(label: MetadataValue): void {
  const labelNameInput = getLabelNameInput();
  const target = labelNameInput;
  const labelGroup = new VariationsGroup(
    'Label',
    [labelNameInput],
    metadataValueAsArray(label),
    false,
    false,
    target
  );

  setSection(
    new Section(
      'label',
      'Bandcamp page label or artist name',
      metadataValueAsString(label)
    )
  );

  setupSectionGroupHints(labelGroup);
}
