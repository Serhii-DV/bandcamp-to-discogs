import { convertToAlias } from '../../../utils/utils';
import { FormElement } from './types';
import { Variation } from './variation';

export class VariationsGroup {
  title: string;
  alias: string;
  targets: FormElement[];
  variations: Variation[];

  constructor(
    title: string,
    targets: FormElement[],
    variations: Variation[] | string[]
  ) {
    this.title = title;
    this.alias = convertToAlias(title);
    this.targets = targets;
    this.variations = variations.map((variation) =>
      variation instanceof Variation ? variation : new Variation(variation)
    );
  }
}
