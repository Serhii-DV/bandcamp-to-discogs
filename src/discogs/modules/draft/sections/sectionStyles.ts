import { element } from '../../../../utils/html';
import { Metadata } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { setSection } from '../utils';

export function setupSectionStyles(metadata: Metadata): void {
  const stylesSelect = element('#release-styles') as HTMLSelectElement;

  const stylesGroup = new VariationsGroup(
    '',
    [stylesSelect],
    metadata.genres.autoDetectedStyles,
    true,
    false,
    stylesSelect
  );

  stylesGroup.setupHints();

  setSection(
    new Section(
      'styles',
      'Bandcamp auto generated styles',
      'Styles were generated based on Bandcamp release keywords.'
    )
  );
}
