import { arrayUnique, convertToAlias } from '../../../utils/utils';
import { FormElement } from './types';
import { Variation } from './variation';

export class VariationsGroup {
  title: string;
  alias: string;
  elements: FormElement[];
  variations: Variation[];
  allowSelectAll: boolean;

  constructor(
    title: string,
    elements: FormElement[],
    variations: string[],
    allowSelectAll: boolean = false
  ) {
    this.title = title;
    this.alias = convertToAlias(title);
    this.elements = elements;
    this.variations = arrayUnique(
      variations.filter((variation) => !!variation)
    ).map((variation) => new Variation(variation));
    this.allowSelectAll = allowSelectAll;
  }
}
