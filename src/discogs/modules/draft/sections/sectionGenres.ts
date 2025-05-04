import { elements, valueToHtml } from '../../../../utils/html';
import { Metadata } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { setSection } from '../utils';

export function setupSectionGenres(metadata: Metadata): void {
  const genresGroup = new VariationsGroup(
    'Genres',
    elements('.genres input[type="checkbox"]') as HTMLInputElement[],
    metadata.genres.autoDetectedGenres,
    true
  );

  setSection(
    new Section(
      'genres',
      'Bandcamp genres related data',
      valueToHtml({ keywords: metadata.genres.keywords }),
      [genresGroup]
    )
  );
}
