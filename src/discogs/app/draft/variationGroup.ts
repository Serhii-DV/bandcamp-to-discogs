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
  multiChoice: boolean;
  parent?: HTMLElement | null;
  draggable: boolean;
  container?: HTMLElement | null;
  target: HTMLElement;
  placement: 'before' | 'after';
  hintButton?: HintButton;
  button: HTMLElement | null = null;

  constructor(
    title: string,
    elements: FormElement[],
    variations: string[],
    multiChoice: boolean = false,
    draggable: boolean = false,
    target: HTMLElement,
    container?: HTMLElement | null,
    placement: 'before' | 'after' = 'before'
  ) {
    this.title = title;
    this.alias = convertToAlias(title);
    this.elements = elements;
    this.container = container;
    this.variations = arrayUnique(
      variations.filter((variation) => !!variation)
    ).map((variation) => new Variation(variation));
    this.multiChoice = multiChoice;
    this.draggable = draggable;
    this.target = target;
    this.placement = placement;

    // Initialize the hint button instance
    this.hintButton = new HintButton(
      this.elements,
      this.variations,
      this.target,
      this.placement
    );
  }

  // Method to set up the hint button
  setupHints(): HTMLElement | null {
    this.button = this.hintButton?.setup() || null;
    return this.button;
  }
}
