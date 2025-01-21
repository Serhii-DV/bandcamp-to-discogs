import { convertToAlias } from '../../../utils/utils';
import { FormElement } from './types';
import { Variation } from './variation';

export class VariationsGroup {
  title: string;
  alias: string;
  elements: FormElement[];
  variations: Variation[];

  constructor(title: string, elements: FormElement[], variations: Variation[]) {
    this.title = title;
    this.alias = convertToAlias(title);
    this.elements = elements;
    this.variations = variations;
  }
}
