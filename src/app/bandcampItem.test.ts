import { BandcampItem, createBandcampItemMap } from './bandcampItem';
import { BandcampURL } from './core/bandcampUrl';

// Mock subclass to test the abstract BandcampItem
class MockBandcampItem extends BandcampItem {}

describe('BandcampItem', () => {
  const testUrl = 'https://artist.bandcamp.com/';
  const testUuid = '755a15a9-d6bc-5ee4-9b87-efd498702f04';
  const testImage = 'https://image.url';
  const testVisit = new Date('2025-01-01');
  const testId = 123;

  describe('constructor', () => {
    it('should create an instance with all properties', () => {
      const item = new MockBandcampItem(testUrl, testImage, testVisit, testId);

      expect(item).toBeInstanceOf(MockBandcampItem);
      expect(item.url).toBeInstanceOf(BandcampURL);
      expect(item.url.toString()).toBe(testUrl);
      expect(item.uuid).toBe(testUuid);
      expect(item.image).toBe(testImage);
      expect(item.visit).toEqual(testVisit);
      expect(item.id).toBe(testId);
    });

    it('should create an instance with only the required properties', () => {
      const item = new MockBandcampItem(testUrl);

      expect(item.url.toString()).toBe(testUrl);
      expect(item.uuid).toBe(testUuid);
      expect(item.image).toBeUndefined();
      expect(item.visit).toBeUndefined();
      expect(item.id).toBeUndefined();
    });
  });

  describe('artistHostname', () => {
    it('should return the hostname of the Bandcamp URL', () => {
      const item = new MockBandcampItem(testUrl);
      expect(item.artistHostname).toBe('artist.bandcamp.com');
    });
  });

  describe('artistUrl', () => {
    it('should return the full artist URL with protocol', () => {
      const item = new MockBandcampItem(testUrl);
      expect(item.artistUrl).toBe('https://artist.bandcamp.com');
    });
  });
});

describe('createBandcampItemMap', () => {
  it('should create a map from an array of BandcampItems using UUIDs as keys', () => {
    const item1 = new MockBandcampItem('https://artist1.bandcamp.com');
    const item2 = new MockBandcampItem('https://artist2.bandcamp.com');

    const map = createBandcampItemMap([item1, item2]);

    expect(map.size).toBe(2);
    expect(map.get(item1.uuid)).toBe(item1);
    expect(map.get(item2.uuid)).toBe(item2);
  });

  it('should return an empty map if given an empty array', () => {
    const map = createBandcampItemMap([]);
    expect(map.size).toBe(0);
  });
});
