const bandcampHost = 'bandcamp.com';
const bandcampDomain = 'https://' + bandcampHost;

export class BandcampURL {
  public url: URL;

  constructor(url: string) {
    if (!isValidBandcampURL(url)) {
      throw new Error(`Wrong Bandcamp URL: ${url}`);
    }

    try {
      url = removeQueryParams(url);
      url = removeBandcampMusicPath(url);
      this.url = new URL(url);
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  get hostname(): string {
    return this.url.hostname;
  }

  /**
   * Returns the protocol and hostname of the URL.
   */
  get hostnameWithProtocol(): string {
    return `${this.url.protocol}//${this.url.hostname}`;
  }

  /**
   * Returns the subdomain of the URL's hostname or an empty string if none exists.
   */
  get subdomain(): string {
    const parts = this.url.hostname.split('.');
    if (parts.length > 2) {
      return parts.slice(0, -2).join('.');
    }
    return '';
  }

  /**
   * Returns the URL without the protocol.
   */
  get withoutProtocol(): string {
    return `${this.url.hostname}${this.url.pathname}${this.url.search}${this.url.hash}`;
  }

  /**
   * Returns the URL without query parameters.
   */
  get withoutQueryParams(): string {
    const urlCopy = new URL(this.url.toString());
    urlCopy.search = '';
    return urlCopy.toString();
  }

  /**
   * Returns the pathname of the URL.
   */
  get pathname(): string {
    return this.url.pathname;
  }

  get isRegular(): boolean {
    return this.toString().includes(bandcampDomain);
  }

  get isMusic(): boolean {
    const path = this.pathname;
    return path === '/' || path === '/music';
  }

  get isAlbum(): boolean {
    return this.toString().includes(bandcampHost + '/album/');
  }

  /**
   * Returns the full URL as a string.
   * @returns The string representation of the URL.
   */
  toString(): string {
    return this.url.toString();
  }
}

export function isValidBandcampURL(url: string): boolean {
  return url.includes(bandcampHost);
}

function removeQueryParams(url: string): string {
  const urlObj = new URL(url);
  urlObj.search = '';
  return urlObj.toString();
}

function removeBandcampMusicPath(url: string): string {
  const urlObj = new URL(url);
  const segments = urlObj.pathname.split('/').filter(Boolean);

  if (segments[segments.length - 1] === 'music') {
    segments.pop();
    urlObj.pathname = '/' + segments.join('/');
  }

  return urlObj.toString();
}
