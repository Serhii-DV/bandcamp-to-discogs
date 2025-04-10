import { convertToAlias } from 'src/utils/string';
import { arrayUnique } from '../../../utils/utils';
import { FormElement } from './types';
import { Variation } from './variation';

export class VariationsGroup {
  title: string;
  alias: string;
  elements: FormElement[];
  variations: Variation[];
  multiChoice: boolean;
  draggable: boolean;
  container?: HTMLElement | null;

  constructor(
    title: string,
    elements: FormElement[],
    variations: string[],
    multiChoice: boolean = false,
    draggable: boolean = false,
    container?: HTMLElement | null
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
  }
}
