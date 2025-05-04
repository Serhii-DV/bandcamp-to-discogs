import {
  MetadataValue,
  metadataValueAsArray,
  metadataValueAsString
} from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getCountrySelect } from '../html';
import { setSection, setupSectionGroupHints, setCountry } from '../utils';

export function setupSectionCountry(country: MetadataValue): void {
  const countryGroup = new VariationsGroup(
    'Country',
    [getCountrySelect()],
    metadataValueAsArray(country)
  );
  const countryValue = metadataValueAsString(country);

  setSection(new Section('country', 'Bandcamp country', countryValue));

  setCountry(countryValue);
  setupSectionGroupHints(countryGroup);
}
