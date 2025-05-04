import { click, element, elements } from '../../../../utils/html';
import { Metadata } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getAddCreditButton, getSection } from '../html';
import { setSection, setupSectionGroupHints } from '../utils';

export function setupSectionCredits(metadata: Metadata): void {
  const addCreditBtn = getAddCreditButton();
  const section = getSection('credits');
  const inputsContainer = element('.drag-drop-list', section);
  const groups: VariationsGroup[] = [];

  metadata.credits.items.forEach((credit, index) => {
    const artistNameInputs = elements(
      '#artist-name-credits-input-' + index,
      inputsContainer
    ) as HTMLInputElement[];
    const artistListItem = element(
      "li[data-path*='" + index + "'] .drag_drop_content",
      inputsContainer
    );
    const artistRoleInputs = elements(
      '#add-role-input-' + index,
      inputsContainer
    ) as HTMLInputElement[];

    if (artistNameInputs.length === 0) {
      click(addCreditBtn);
    }

    const artist = credit.artist.join(', ');
    const artistGroup = new VariationsGroup(
      artist,
      artistRoleInputs,
      [credit.roles.join(', ')],
      false,
      true,
      inputsContainer
    );
    artistGroup.parent = artistListItem;

    const artistRolesGroup = new VariationsGroup(
      `Artist (${credit.artist.join(', ')})`,
      artistNameInputs,
      credit.artist,
      false,
      true,
      inputsContainer
    );
    artistRolesGroup.parent = artistListItem;

    groups.push(artistGroup);
    groups.push(artistRolesGroup);
  });

  setSection(new Section('credits', 'Bandcamp credits', metadata.credits.text));

  groups.forEach(setupSectionGroupHints);
}
