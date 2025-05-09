import { click, element, elements, onClick } from '../../../../utils/html';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getSection } from '../html';
import { setSection } from '../utils';
import { ArtistMetadata } from '../../../app/metadata';
import { MetadataValueObject } from '../../../app/metadataValue';

export function setupSectionArtist(artist: ArtistMetadata): void {
  const artistSection = getSection('artist');
  const addArtistBtn = element(
    '#add-artist',
    artistSection
  ) as HTMLButtonElement;
  const artistRows = elements('.drag_drop_content', artistSection);

  if (artistRows.length < artist.artists.length) {
    click(addArtistBtn, artist.artists.length - artistRows.length);
  }

  const removeButtons = elements(
    'button.drag_drop_field_remove_row',
    artistSection
  );
  onClick(removeButtons, () => {
    setupArtistsInputs(artist, artistSection);
  });
  onClick(addArtistBtn, () => {
    setupArtistsInputs(artist, artistSection);
  });

  setupArtistsInputs(artist, artistSection);
  setSection(new Section('artist', 'Bandcamp artist name', artist.value));
}

function setupArtistsInputs(
  artist: ArtistMetadata,
  section: HTMLElement
): void {
  artist.artists.forEach((artist, index) => {
    const artistRow = element(
      "li[data-path='/artists/" + index + "'] .drag_drop_content",
      section
    ) as HTMLElement;

    const artistNameInput = element(
      'input[data-type="artist-name"]',
      artistRow
    ) as HTMLInputElement;
    const artistNameMeta = new MetadataValueObject(artist.name);
    const artistNameGroup = new VariationsGroup(
      'Name',
      [artistNameInput],
      artistNameMeta.toArray(),
      false,
      true,
      artistNameInput
    );

    artistNameGroup.setupHints();

    const artistJoinInput = element(
      'input[placeholder="Join"]',
      artistRow
    ) as HTMLInputElement;

    if (artistJoinInput) {
      const artistJoinGroup = new VariationsGroup(
        'Join',
        [artistJoinInput],
        [artist.join],
        false,
        true,
        artistJoinInput
      );

      artistJoinGroup.setupHints();
    }
  });
}
