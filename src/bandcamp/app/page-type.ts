export enum PageTypeEnum {
  ALBUM = 'album',
  ARTISTS = 'artists',
  COMMUNITY = 'community',
  MERCH = 'merch',
  MUSIC = 'music',
  TRACK = 'track',
  VIDEO = 'video',
  UNKNOWN = 'unknown'
}

export class PageType {
  value: PageTypeEnum;

  constructor(value: PageTypeEnum) {
    this.value = value;
  }

  isAlbum = (): boolean => this.value === PageTypeEnum.ALBUM;
  isArtists = (): boolean => this.value === PageTypeEnum.ARTISTS;
  isCommunity = (): boolean => this.value === PageTypeEnum.COMMUNITY;
  isMerch = (): boolean => this.value === PageTypeEnum.MERCH;
  isMusic = (): boolean => this.value === PageTypeEnum.MUSIC;
  isTrack = (): boolean => this.value === PageTypeEnum.TRACK;
  isVideo = (): boolean => this.value === PageTypeEnum.VIDEO;
  isUnknown = (): boolean => this.value === PageTypeEnum.UNKNOWN;
}

export class PageTypeDetector {
  private url: string;

  constructor() {
    this.url = window.location.href;
  }

  detect = (): PageType => {
    let value: PageTypeEnum = PageTypeEnum.UNKNOWN;

    if (this.isAlbum()) {
      value = PageTypeEnum.ALBUM;
    } else if (this.isArtists()) {
      value = PageTypeEnum.ARTISTS;
    } else if (this.isCommunity()) {
      value = PageTypeEnum.COMMUNITY;
    } else if (this.isMusic()) {
      value = PageTypeEnum.MUSIC;
    } else if (this.isMerch()) {
      value = PageTypeEnum.MERCH;
    } else if (this.isTrack()) {
      value = PageTypeEnum.TRACK;
    } else if (this.isVideo()) {
      value = PageTypeEnum.VIDEO;
    }

    return new PageType(value);
  };

  isAlbum = (): boolean => this.url.includes('/album/');
  isArtists = (): boolean =>
    this.url.includes('/artists/') || !!document.querySelector('.artists-grid');
  isCommunity = (): boolean => this.url.includes('/community/');
  isMerch = (): boolean => this.url.includes('/merch/');
  isMusic = (): boolean =>
    this.url.includes('/music/') || !!document.querySelector('#music-grid');
  isTrack = (): boolean => this.url.includes('/track/');
  isVideo = (): boolean => this.url.includes('/video/');
}
