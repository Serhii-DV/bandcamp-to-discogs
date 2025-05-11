import { element, elements, valueToHtml } from '../../../../utils/html';
import { Metadata } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { setSection } from '../utils';
import { getSection } from '../html';

export function setupSectionGenres(metadata: Metadata): void {
  const genresSection = getSection('genres');
  const genreInputs = elements(
    '.genres input[type="checkbox"]'
  ) as HTMLInputElement[];
  const target = element('.arrow_nav_container', genresSection) as HTMLElement;

  const genresGroup = new VariationsGroup(
    'Genres',
    genreInputs,
    metadata.genres.autoDetectedGenres,
    true,
    false,
    target
  );

  genresGroup.setupHints();

  setSection(
    new Section(
      'genres',
      'Bandcamp genres related data',
      'Genres were generated based on Bandcamp release keywords.' +
        valueToHtml({
          keywords: metadata.genres.keywords,
          genres: metadata.genres.autoDetectedGenres
        })
    )
  );
}
