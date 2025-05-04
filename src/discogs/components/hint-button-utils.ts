import { FormElement } from '../app/draft/types';
import { Variation } from '../app/draft/variation';
import { HintButton } from './hint-button';

/**
 * A utility function that wraps the HintButton.createFor static method
 * to serve as a drop-in replacement for the legacy setupFormElementHintButton function
 */
export function setupFormElementHintButton(
  element: FormElement,
  variations: Variation[]
): void {
  HintButton.createFor(element, variations);
}

/**
 * Setup hint buttons for an array of form elements
 */
export function setupFormElementsHintButtons(
  elements: FormElement[],
  variations: Variation[]
): void {
  elements.forEach((element) => {
    setupFormElementHintButton(element, variations);
  });
}
