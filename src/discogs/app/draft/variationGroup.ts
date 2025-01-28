import { arrayUnique, convertToAlias } from '../../../utils/utils';
import { FormElement } from './types';
import { Variation } from './variation';

export class VariationsGroup {
  title: string;
  alias: string;
  elements: FormElement[];
  variations: Variation[];
  multiChoice: boolean;

  constructor(
    title: string,
    elements: FormElement[],
    variations: string[],
    multiChoice: boolean = false
  ) {
    this.title = title;
    this.alias = convertToAlias(title);
    this.elements = elements;
    this.variations = arrayUnique(
      variations.filter((variation) => !!variation)
    ).map((variation) => new Variation(variation));
    this.multiChoice = multiChoice;
  }
}
