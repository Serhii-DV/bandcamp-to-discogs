import { MetadataValueObject } from '../../../app/metadata';
import { VariationsGroup } from '../../../app/draft/variationGroup';
import { Section } from '../../../app/draft/section';
import { getCountrySelect } from '../html';
import { setSection, setupSectionGroupHints, setCountry } from '../utils';

export function setupSectionCountry(country: MetadataValueObject): void {
  const countrySelect = getCountrySelect();
  const countryGroup = new VariationsGroup(
    'Country',
    [countrySelect],
    country.toArray(),
    false,
    false,
    countrySelect
  );
  const countryValue = country.toString();

  setSection(new Section('country', 'Bandcamp country', countryValue));

  setCountry(countryValue);
  setupSectionGroupHints(countryGroup);
}
