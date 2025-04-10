import { PageType, PageTypeEnum, PageTypeDetector } from './page-type';

describe('PageType', () => {
  it('should correctly initialize with a PageTypeEnum value', () => {
    const pageType = new PageType(PageTypeEnum.ALBUM);
    expect(pageType.value).toBe(PageTypeEnum.ALBUM);
  });

  it('should correctly identify album pages', () => {
    const pageType = new PageType(PageTypeEnum.ALBUM);
    expect(pageType.isAlbum()).toBe(true);
    expect(pageType.isTrack()).toBe(false);
  });

  it('should correctly identify artists pages', () => {
    const pageType = new PageType(PageTypeEnum.ARTISTS);
    expect(pageType.isArtists()).toBe(true);
  });

  it('should correctly identify community pages', () => {
    const pageType = new PageType(PageTypeEnum.COMMUNITY);
    expect(pageType.isCommunity()).toBe(true);
  });

  it('should correctly identify merch pages', () => {
    const pageType = new PageType(PageTypeEnum.MERCH);
    expect(pageType.isMerch()).toBe(true);
  });

  it('should correctly identify music pages', () => {
    const pageType = new PageType(PageTypeEnum.MUSIC);
    expect(pageType.isMusic()).toBe(true);
  });

  it('should correctly identify track pages', () => {
    const pageType = new PageType(PageTypeEnum.TRACK);
    expect(pageType.isTrack()).toBe(true);
  });

  it('should correctly identify video pages', () => {
    const pageType = new PageType(PageTypeEnum.VIDEO);
    expect(pageType.isVideo()).toBe(true);
  });

  it('should correctly identify unknown pages', () => {
    const pageType = new PageType(PageTypeEnum.UNKNOWN);
    expect(pageType.isUnknown()).toBe(true);
  });
});

describe('PageTypeDetector', () => {
  it('should detect album page type', () => {
    const detector = new PageTypeDetector(
      'https://artist.bandcamp.com/album/sample-album'
    );
    expect(detector.detect().value).toBe(PageTypeEnum.ALBUM);
  });

  it('should detect artists page type', () => {
    const detector = new PageTypeDetector(
      'https://artist.bandcamp.com/artists/'
    );
    expect(detector.detect().value).toBe(PageTypeEnum.ARTISTS);
  });

  it('should detect community page type', () => {
    const detector = new PageTypeDetector(
      'https://artist.bandcamp.com/community/'
    );
    expect(detector.detect().value).toBe(PageTypeEnum.COMMUNITY);
  });

  it('should detect merch page type', () => {
    const detector = new PageTypeDetector('https://artist.bandcamp.com/merch/');
    expect(detector.detect().value).toBe(PageTypeEnum.MERCH);
  });

  it('should detect music page type', () => {
    const detector = new PageTypeDetector('https://artist.bandcamp.com/music/');
    expect(detector.detect().value).toBe(PageTypeEnum.MUSIC);
  });

  it('should detect track page type', () => {
    const detector = new PageTypeDetector(
      'https://artist.bandcamp.com/track/sample-track'
    );
    expect(detector.detect().value).toBe(PageTypeEnum.TRACK);
  });

  it('should detect video page type', () => {
    const detector = new PageTypeDetector('https://artist.bandcamp.com/video/');
    expect(detector.detect().value).toBe(PageTypeEnum.VIDEO);
  });

  it('should detect unknown page type for unmatched URLs', () => {
    const detector = new PageTypeDetector(
      'https://artist.bandcamp.com/unknown/'
    );
    expect(detector.detect().value).toBe(PageTypeEnum.UNKNOWN);
  });
});
