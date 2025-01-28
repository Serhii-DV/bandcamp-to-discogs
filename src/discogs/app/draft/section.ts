import { VariationsGroup } from './variationGroup';

export class Section {
  section: string;
  title: string;
  content: string;
  variationsGroups: VariationsGroup[];

  constructor(
    section: string,
    title: string,
    content?: string,
    variationsGroups?: VariationsGroup[]
  ) {
    this.section = section;
    this.title = title;
    this.content = content || '';
    this.variationsGroups = variationsGroups || [];
  }
}
