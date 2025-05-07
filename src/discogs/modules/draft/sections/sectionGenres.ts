import { elements, valueToHtml } from '../../../../utils/html';
import { Metadata } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { setSection } from '../utils';

export function setupSectionGenres(metadata: Metadata): void {
  const genreInputs = elements(
    '.genres input[type="checkbox"]'
  ) as HTMLInputElement[];

  // Use the first checkbox as the target or create a dummy element if no checkboxes exist
  const target =
    genreInputs.length > 0
      ? genreInputs[0]
      : (document.querySelector('.genres') as HTMLElement);

  const genresGroup = new VariationsGroup(
    'Genres',
    genreInputs,
    metadata.genres.autoDetectedGenres,
    true,
    false,
    target
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
