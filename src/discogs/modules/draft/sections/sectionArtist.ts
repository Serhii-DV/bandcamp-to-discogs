import { click, element, elements } from '../../../../utils/html';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getSection } from '../html';
import { setSection, setupGroupInputObserver } from '../utils';
import { ArtistMetadata } from '../../../app/metadata';
import { MetadataValueObject } from '../../../app/metadataValue';

export function setupSectionArtist(artist: ArtistMetadata): void {
  const artistSection = getSection('artist');
  const inputsContainer = element('.drag-drop-list', artistSection);
  const btnAddArtist = element(
    '#add-artist',
    artistSection
  ) as HTMLButtonElement;
  const artistRows = elements('.drag_drop_content', inputsContainer);

  if (artistRows.length < artist.artists.length) {
    click(btnAddArtist, artist.artists.length - artistRows.length);
  }

  artist.artists.forEach((artist, index) => {
    const artistRow = element(
      "li[data-path='/artists/" + index + "'] .drag_drop_content",
      inputsContainer
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
    setupGroupInputObserver(artistNameGroup);

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
      setupGroupInputObserver(artistJoinGroup);
    }
  });

  setSection(new Section('artist', 'Bandcamp artist name', artist.value));
}
