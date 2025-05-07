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
  const qtyInput = getQuantityInput();
  const qtyGroup = new VariationsGroup(
    'Quantity',
    [qtyInput],
    metadataValueAsArray(format.qty),
    false,
    false,
    qtyInput
  );

  const formatDescriptionTypeElements = elements(
    '.format_descriptions_type_column'
  );
  const formatFileTypeContainer = formatDescriptionTypeElements[0];
  const formatDescriptionContainer = formatDescriptionTypeElements[2];

  const fileTypeCheckboxes = elements(
    'input[type="checkbox"]',
    formatFileTypeContainer
  ) as HTMLInputElement[];

  const fileTypeTarget =
    fileTypeCheckboxes.length > 0
      ? fileTypeCheckboxes[0]
      : (element(
          '.format_descriptions_type h4 span',
          formatFileTypeContainer
        ) as HTMLElement);

  const fileTypeGroup = new VariationsGroup(
    'File Type',
    fileTypeCheckboxes,
    metadataValueAsArray(format.fileType),
    false,
    false,
    fileTypeTarget
  );

  const formatDescriptionCheckboxes = elements(
    'input[type="checkbox"]',
    formatDescriptionContainer
  ) as FormElement[];

  const formatDescriptionTarget =
    formatDescriptionCheckboxes.length > 0
      ? (formatDescriptionCheckboxes[0] as HTMLElement)
      : (element(
          '.format_descriptions_type h4 span',
          formatDescriptionContainer
        ) as HTMLElement);

  const formatDescriptionGroup = new VariationsGroup(
    'Format Description',
    formatDescriptionCheckboxes,
    metadataValueAsArray(format.description),
    false,
    false,
    formatDescriptionTarget
  );

  const freeTextInput = element('input#free-text-input-0') as HTMLInputElement;
  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    [freeTextInput],
    metadataValueAsArray(format.freeText),
    false,
    false,
    freeTextInput
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
      [formatDescriptionGroup]
    )
  );

  setFormat(qtyValue, fileTypeValue, descriptionValue);
  setupSectionGroupsHints([qtyGroup, fileTypeGroup, formatFreeTextGroup]);
}
