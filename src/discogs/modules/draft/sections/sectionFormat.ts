import { element, elements, valueToHtml } from '../../../../utils/html';
import { Format } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getQuantityInput } from '../html';
import { setSection, setFormat } from '../utils';
import { FormElement } from '../../../app/draft/types';
import {
  metadataValueAsArray,
  metadataValueAsString
} from '../../../app/metadataValue';

export function setupSectionFormat(format: Format): void {
  setupQuantity(format);
  setupFileType(format);
  setupFileDescription(format);
  setupFreeText(format);

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
      })
    )
  );

  setFormat(qtyValue, fileTypeValue, descriptionValue);
}

function setupQuantity(format: Format): void {
  const qtyInput = getQuantityInput();
  const qtyGroup = new VariationsGroup(
    'Quantity',
    [qtyInput],
    metadataValueAsArray(format.qty),
    qtyInput
  );

  qtyGroup.setupHints();
}

function setupFileType(format: Format): void {
  const formatDescriptionTypeElements = elements(
    '.format_descriptions_type_column'
  );
  const formatFileTypeContainer = formatDescriptionTypeElements[0];

  const fileTypeCheckboxes = elements(
    'input[type="checkbox"]',
    formatFileTypeContainer
  ) as HTMLInputElement[];

  const fileTypeTarget = element(
    '.format_descriptions_type h4 span',
    formatFileTypeContainer
  ) as HTMLElement;

  const fileTypeGroup = new VariationsGroup(
    'File Type',
    fileTypeCheckboxes,
    metadataValueAsArray(format.fileType),
    fileTypeTarget
  );

  fileTypeGroup.setupHints();
}

function setupFileDescription(format: Format): void {
  const formatDescriptionTypeElements = elements(
    '.format_descriptions_type_column'
  );
  const formatDescriptionContainer = formatDescriptionTypeElements[2];

  const formatDescriptionCheckboxes = elements(
    'input[type="checkbox"]',
    formatDescriptionContainer
  ) as FormElement[];

  const formatDescriptionTarget = element(
    '.format_descriptions_type h4 span',
    formatDescriptionContainer
  ) as HTMLElement;

  const formatDescriptionGroup = new VariationsGroup(
    'Format Description',
    formatDescriptionCheckboxes,
    metadataValueAsArray(format.description),
    formatDescriptionTarget
  );

  formatDescriptionGroup.setupHints();
}

function setupFreeText(format: Format): void {
  const freeTextInput = element('input#free-text-input-0') as HTMLInputElement;
  const formatFreeTextGroup = new VariationsGroup(
    'Free Text',
    [freeTextInput],
    metadataValueAsArray(format.freeText),
    freeTextInput
  );

  formatFreeTextGroup.setupHints();
}
