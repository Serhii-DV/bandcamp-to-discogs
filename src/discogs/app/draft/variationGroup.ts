import { convertToAlias } from '../../../utils/string';
import { arrayUnique } from '../../../utils/utils';
import { FormElement } from './types';
import { Variation } from './variation';
import { HintButton } from '../../components/hint-button';

export class VariationsGroup {
  title: string;
  alias: string;
  elements: FormElement[];
  variations: Variation[];
  target: HTMLElement;
  hintButton?: HintButton;
  button: HTMLElement | null = null;

  constructor(
    title: string,
    elements: FormElement[],
    variations: string[],
    target: HTMLElement,
    placement: 'before' | 'after' = 'before'
  ) {
    this.title = title;
    this.alias = convertToAlias(title);
    this.elements = elements;
    this.variations = arrayUnique(
      variations.filter((variation) => !!variation)
    ).map((variation) => new Variation(variation));
    this.target = target;

    // Initialize the hint button instance
    this.hintButton = new HintButton(
      this.elements,
      this.variations,
      this.target,
      placement
    );
  }

  // Method to set up the hint button
  setupHints(): HTMLElement | null {
    this.button = this.hintButton?.setup() || null;
    return this.button;
  }
}
