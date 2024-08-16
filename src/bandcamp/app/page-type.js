const PageTypeEnum = {
  ALBUM: 'album',
  ARTISTS: 'artists',
  COMMUNITY: 'community',
  MERCH: 'merch',
  MUSIC: 'music',
  TRACK: 'track',
  VIDEO: 'video',
  UNKNOWN: 'unknown'
};

export class PageType {
  constructor(value) {
    this.value = value;
  }

  isAlbum = () => this.value === PageTypeEnum.ALBUM;
  isArtists = () => this.value === PageTypeEnum.ARTISTS;
  isCommunity = () => this.value === PageTypeEnum.COMMUNITY;
  isMerch = () => this.value === PageTypeEnum.MERCH;
  isMusic = () => this.value === PageTypeEnum.MUSIC;
  isTrack = () => this.value === PageTypeEnum.TRACK;
  isVideo = () => this.value === PageTypeEnum.VIDEO;
  isUnknow = () => this.value === PageTypeEnum.UNKNOWN;
}

export class PageTypeDetector {
  constructor() {
    this.url = window.location.href;
  }

  detect = () => {
    const self = this;
    let value = PageTypeEnum.UNKNOWN;

    if (self.isAlbum()) {
      value = PageTypeEnum.ALBUM;
    } else if (self.isArtists()) {
      value = PageTypeEnum.ARTISTS;
    } else if (self.isCommunity()) {
      value = PageTypeEnum.COMMUNITY;
    } else if (self.isMusic()) {
      value = PageTypeEnum.MUSIC;
    } else if (self.isMerch()) {
      value = PageTypeEnum.MERCH;
    } else if (self.isTrack()) {
      value = PageTypeEnum.TRACK;
    } else if (self.isVideo()) {
      value = PageTypeEnum.VIDEO;
    }

    return new PageType(value);
  };

  isAlbum = () => this.url.includes('/album/');
  isArtists = () =>
    this.url.includes('/artists/') || !!document.querySelector('.artists-grid');
  isCommunity = () => this.url.includes('/community/');
  isMerch = () => this.url.includes('/merch/');
  isMusic = () =>
    this.url.includes('/music/') || !!document.querySelector('#music-grid');
  isTrack = () => this.url.includes('/track/');
  isVideo = () => this.url.includes('/video/');
}
