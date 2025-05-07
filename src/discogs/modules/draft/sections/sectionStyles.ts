import {
  addClass,
  element,
  elements,
  onClick,
  removeClass
} from '../../../../utils/html';
import { Metadata } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getSection } from '../html';
import { makeVariationsGroupClass, setSection } from '../utils';

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

  setSection(
    new Section(
      'styles',
      'Bandcamp auto generated styles',
      'Styles were generated based on Bandcamp release keywords.',
      [stylesGroup]
    )
  );

  const variationsGroupElement = element(
    `.${makeVariationsGroupClass(stylesGroup)} .b2d-variations`
  );
  if (!variationsGroupElement) return;

  const variationButtons = elements(
    '.b2d-variation',
    variationsGroupElement
  ) as HTMLButtonElement[];
  const styleSection = getSection('styles');
  const stylesButtonGroup = element('.styles ul', styleSection);

  const getStyleButtons = (): HTMLElement[] =>
    elements('button.facet-tag', stylesButtonGroup as Element);

  onClick(stylesButtonGroup, (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'UL') return;

    // Update buttons status after some time because style buttons need to be updated
    setTimeout(updateVariationButtonsState, 10);
  });

  const updateVariationButtonsState = (): void => {
    removeClass(variationButtons, 'button-green');

    const styleButtons = getStyleButtons();
    styleButtons.forEach((styleButton) => {
      variationButtons.forEach((variationButton) => {
        if (variationButton.value === styleButton.textContent?.trim()) {
          addClass(variationButton, 'button-green');
        }
      });
    });
  };

  const clearButton = element('.b2d-clear-button', variationsGroupElement);
  onClick(clearButton as HTMLElement, () => {
    // It re-generates styles block every time, so we just need to remove
    // the first button until there are no buttons left
    getStyleButtons().forEach(() => {
      let button = element('button.facet-tag', stylesButtonGroup as Element);
      button?.click();
    });
  });

  onClick(variationButtons, updateVariationButtonsState);
  updateVariationButtonsState();
}
