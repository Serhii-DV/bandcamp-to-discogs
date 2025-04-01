import { ArtistItem } from './artistItem';
import { IArtistItem, StorageData } from 'src/types';

describe('ArtistItem', () => {
  const testUrl = 'https://artist.bandcamp.com/';
  const testName = 'Artist Name';
  const testUuid = '755a15a9-d6bc-5ee4-9b87-efd498702f04';
  const testImage = 'https://image.url';
  const testVisit = '2025-01-01';
  const testVisitDate = new Date(testVisit);
  const testId = 123;

  describe('constructor', () => {
    it('should create an instance of ArtistItem with all properties', () => {
      const artistItem = new ArtistItem(
        testUrl,
        testName,
        testImage,
        testVisitDate,
        testId
      );

      expect(artistItem).toBeInstanceOf(ArtistItem);
      expect(artistItem.url.toString()).toBe(testUrl);
      expect(artistItem.name).toBe(testName);
      expect(artistItem.image).toBe(testImage);
      expect(artistItem.visit).toEqual(testVisitDate);
      expect(artistItem.id).toBe(testId);
    });

    it('should create an instance of ArtistItem without optional properties', () => {
      const artistItem = new ArtistItem(testUrl, testName);

      expect(artistItem).toBeInstanceOf(ArtistItem);
      expect(artistItem.url.toString()).toBe(testUrl);
      expect(artistItem.name).toBe(testName);
      expect(artistItem.image).toBeUndefined();
      expect(artistItem.visit).toBeUndefined();
      expect(artistItem.id).toBeUndefined();
    });
  });

  describe('toStorageData', () => {
    it('should return the correct StorageData format', () => {
      const artistItem = new ArtistItem(
        testUrl,
        testName,
        testImage,
        testVisitDate,
        testId
      );
      const storageData: StorageData = artistItem.toStorageData();

      expect(storageData.url).toBe(testUrl);
      expect(storageData.name).toBe(testName);
      expect(storageData.image).toBe(testImage);
      expect(storageData.visit).toBe(testVisitDate.toISOString());
      expect(storageData.id).toBe(testId);
    });

    it('should return the correct StorageData format without optional properties', () => {
      const artistItem = new ArtistItem(testUrl, testName);
      const storageData: StorageData = artistItem.toStorageData();

      expect(storageData.url).toBe(testUrl);
      expect(storageData.name).toBe(testName);
      expect(storageData.image).toBeUndefined();
      expect(storageData.visit).toBeUndefined();
      expect(storageData.id).toBeUndefined();
    });
  });

  describe('fromObject', () => {
    it('should correctly create an ArtistItem from an IArtistItem object', () => {
      const artistObj: IArtistItem = {
        url: testUrl,
        name: testName,
        uuid: testUuid,
        image: testImage,
        visit: testVisit,
        id: testId
      };

      const artistItem = ArtistItem.fromObject(artistObj);

      expect(artistItem).toBeInstanceOf(ArtistItem);
      expect(artistItem.url.toString()).toBe(testUrl);
      expect(artistItem.name).toBe(testName);
      expect(artistItem.uuid).toBe(testUuid);
      expect(artistItem.image).toBe(testImage);
      expect(artistItem.visit).toEqual(testVisitDate);
      expect(artistItem.id).toBe(testId);
    });

    it('should correctly create an ArtistItem from an IArtistItem object without optional properties', () => {
      const artistObj: IArtistItem = {
        url: testUrl,
        name: testName,
        uuid: testUuid
      };

      const artistItem = ArtistItem.fromObject(artistObj);

      expect(artistItem).toBeInstanceOf(ArtistItem);
      expect(artistItem.url.toString()).toBe(testUrl);
      expect(artistItem.name).toBe(testName);
      expect(artistItem.uuid).toBe(testUuid);
      expect(artistItem.image).toBeUndefined();
      expect(artistItem.visit).toBeUndefined();
      expect(artistItem.id).toBeUndefined();
    });
  });
});
