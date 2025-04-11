import { Style } from '../../discogs/app/style';
import { getKeywordMapping } from './keywordMapping';

describe('getKeywordMapping', () => {
  it('should return a populated mapping', async () => {
    const result = getKeywordMapping();

    expect(result).toHaveProperty('dark ambient');
    expect(result).toHaveProperty('black metal');
    expect(result).toHaveProperty('martial');
    expect(result).toHaveProperty('martial industrial');
    expect(result['dark ambient']).toBeInstanceOf(Style);
    expect(result['black metal']).toBeInstanceOf(Style);
    expect(result['martial']).toBeInstanceOf(Style);
    expect(result['martial industrial']).toBeInstanceOf(Array);
  });
});
