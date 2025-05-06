import { element, elements, valueToHtml } from '../../../../utils/html';
import {
  Format,
  metadataValueAsArray,
  metadataValueAsString
} from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getQuantityInput } from '../html';
import { setSection, setFormat, setupSectionGroupsHints } from '../utils';
import { FormElement } from '../../../app/draft/types';

export function setupSectionFormat(format: Format): void {
  const qtyGroup = new VariationsGroup(
    'Quantity',
    [getQuantityInput()],
    metadataValueAsArray(format.qty)
  );

  const formatDescriptionTypeElements = elements(
    '.format_descriptions_type_column'
  );
  const formatFileTypeContainer = formatDescriptionTypeElements[0];
  const formatDescriptionContainer = formatDescriptionTypeElements[2];

  const fileTypeGroup = new VariationsGroup(
    'File Type',
    elements(
      'input[type="checkbox"]',
      formatFileTypeContainer
    ) as HTMLInputElement[],
    metadataValueAsArray(format.fileType)
  );

  const formatDescriptionGroup = new VariationsGroup(
    'Format Description',
    elements(
      'input[type="checkbox"]',
      formatDescriptionContainer
    ) as FormElement[],
    metadataValueAsArray(format.description)
  );

  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    [element('input#free-text-input-0') as HTMLInputElement],
    metadataValueAsArray(format.freeText)
  );

  const qtyValue = metadataValueAsString(format.qty);
  const fileTypeValue = metadataValueAsString(format.fileType);
  const descriptionValue = metadataValueAsString(format.description);
  const freeTextValue = metadataValueAsString(format.freeText);

  setSection(
    new Section(
      'format',
      'Bandcamp auto-detected format',
      valueToHtml({
        qty: qtyValue,
        fileType: fileTypeValue,
        description: descriptionValue,
        freeText: freeTextValue
      }),
      [fileTypeGroup, formatDescriptionGroup]
    )
  );

  setFormat(qtyValue, fileTypeValue, descriptionValue);
  setupSectionGroupsHints([qtyGroup, formatFreeTextGroup]);
}
