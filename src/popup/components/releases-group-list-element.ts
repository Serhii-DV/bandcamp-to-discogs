import { Release } from '../../app/release';
import {
  createElementFromHTML,
  getDataAttribute,
  hide,
  show
} from '../../utils/html';
import { showReleaseCard, showReleases } from '../modules/main';
import { ReleaseItem } from '../../app/releaseItem';
import { ArtistItem } from '../../app/artistItem';
import { BandcampItem } from '../../app/bandcampItem';
import { getTextInitials } from '../../utils/string';
import { Music } from '../../app/music';
import { keywordsToDiscogsStyles } from '../../bandcamp/modules/bandcamp';

const HTMLElement =
  globalThis.HTMLElement || (null as unknown as (typeof window)['HTMLElement']);

enum ItemType {
  Link = 'link',
  All = 'all',
  Release = 'release',
  Artist = 'artist'
}

function isValidItemType(type: string): type is ItemType {
  return Object.values(ItemType).includes(type as ItemType);
}

export class ReleasesGroupListElement extends HTMLElement {
  static define(tag = 'releases-group-list', registry = customElements) {
    registry.define(tag, this);
    return this;
  }

  #groupElement: Element | null = createElementFromHTML(
    `<div class="list-group"></div>`
  );

  constructor() {
    super();

    const self = this;
    if (self.#groupElement) {
      self.appendChild(self.#groupElement);
    }
  }

  addItem(
    type: string,
    url: string,
    content: string | Element,
    title: string = '',
    targetBlank: boolean = true,
    onClick: ((event: Event) => void) | null = null
  ): Element | null {
    const self = this;
    const item = createElementFromHTML(
      `<a href="${url}"
        class="list-group-item list-group-item-action"
        title="${title}"
        data-type="${type}"
        ${targetBlank ? ' target="_blank"' : ''}
      ></a>`
    );

    if (self.#groupElement === null || item === null) {
      return null;
    }

    if (content instanceof Element) {
      item.appendChild(content);
    } else {
      item.innerHTML = content;
    }

    if (onClick !== null) {
      item.addEventListener('click', onClick);
    }

    self.#groupElement.appendChild(item);

    return item;
  }

  add(item: BandcampItem | Release | Music) {
    const self = this;

    if (item instanceof ArtistItem) {
      return self.addArtistItem(item);
    } else if (item instanceof ReleaseItem) {
      return self.addReleaseItem(item);
    } else if (item instanceof Release) {
      return self.addRelease(item);
    } else if (item instanceof Music) {
      return self.addMusic(item);
    }

    return self;
  }

  addArtistItem(item: ArtistItem) {
    const self = this;
    const contentElement = self.createReleaseItemContentElement(
      item.name,
      item.artistHostname,
      undefined,
      item.visit,
      item.image
    );

    if (contentElement) {
      const url = item.url.toString();
      self.addItem(
        'artist',
        url,
        contentElement,
        `Visit artist/label page ${url}`,
        true
      );
    }

    return self;
  }

  addMusic(item: Music) {
    const self = this;
    const artist = item.artist;
    const contentElement = self.createReleaseItemContentElement(
      artist.name,
      artist.artistHostname,
      undefined,
      artist.visit,
      artist.image
    );

    if (contentElement) {
      const url = artist.url.toString();
      self.addItem(
        'artist',
        url,
        contentElement,
        `Show artist/label information`,
        false,
        (event: Event) => {
          showReleases(item, undefined);
          event.preventDefault();
        }
      );
    }

    return self;
  }

  addReleaseItem(item: ReleaseItem) {
    const self = this;
    const contentElement = self.createReleaseItemContentElement(
      item.artist.toString(),
      item.artistHostname,
      item.title,
      item.visit
    );

    if (contentElement) {
      const url = item.url.toString();
      self.addItem(
        'release',
        url,
        contentElement,
        `Visit release page ${url}`,
        true
      );
    }

    return self;
  }

  addRelease(release: Release) {
    const self = this;
    const contentElement = self.createReleaseItemContentElement(
      release.releaseItem.artist.toString(),
      release.releaseItem.artistHostname,
      release.releaseItem.title,
      release.releaseItem.visit,
      release.image,
      release.keywords
    );

    if (contentElement) {
      const url = release.url.toString();
      self.addItem(
        'release',
        url,
        contentElement,
        `Open release card`,
        false,
        (event: Event) => {
          showReleaseCard(release);
          event.preventDefault();
        }
      );
    }

    return self;
  }

  addReleases(releases: Release[]) {
    const self = this;
    releases.forEach((release) => self.addRelease(release));
    return self;
  }

  show(type: string = ItemType.All) {
    const self = this;
    const items = self.#groupElement?.querySelectorAll(`.list-group-item`);
    if (!items) return self;
    if (!isValidItemType(type)) {
      type = ItemType.All;
    }

    hide(...items);
    const filtered = [...items].filter((item) => {
      const itemType = getDataAttribute(item, 'type', ItemType.All);
      return (
        itemType === type || type === ItemType.All || itemType === ItemType.Link
      );
    });
    show(...filtered);

    return self;
  }

  private getImagePlaceholder(text?: string): string {
    const title = 'Image placeholder';
    return `<svg class="bd-placeholder-img img-thumbnail"
              width="80"
              height="80"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="${title}"
              preserveAspectRatio="xMidYMid slice"
              focusable="false">
            <title>${title}</title>
            <rect width="100%" height="100%" fill="#111"></rect>
            <text x="50%" y="50%" fill="#999" dy=".3em">${text ? getTextInitials(text) : '-'}</text>
          </svg>`;
  }

  private getImage(url?: string, title?: string, placeholder?: string): string {
    return url
      ? `<img src="${url}" alt="${title}" class="img-fluid" style="width: 80px; height: 80px;">`
      : this.getImagePlaceholder(placeholder);
  }

  private createReleaseItemContentElement(
    artist: string,
    artistHostname: string,
    title?: string,
    visit?: Date,
    image?: string,
    keywords?: string[]
  ): Element | null {
    const self = this;
    const visitDate = visit ?? new Date(0);
    const styles = keywords ? keywordsToDiscogsStyles(keywords) : [];
    const stylesBadges = styles
      .map((keyword) => `<span class="music-style badge">${keyword}</span>`)
      .join(' ');

    return createElementFromHTML(`
      <div class="d-flex justify-content-between">
        <div class="flex-shrink-0">
          ${self.getImage(image, title, artist)}
        </div>
        <div class="flex-grow-1 ms-3">
          <div class="d-flex w-100 justify-content-between">
            <h6 class="release-artist mb-1">${artist}</h6>
            <relative-time class="release-visited-date text-body-secondary" datetime="${visitDate.toISOString()}">${visitDate.toLocaleString()}</relative-time>
          </div>
          <p class="release-title mb-0">${title ?? ''}</p>
          <small class="release-url text-body-secondary text-break">${artistHostname}</small><br>
          <small class="release-styles">${stylesBadges}</small>
        </div>
      </div>`);
  }
}

ReleasesGroupListElement.define();

export default ReleasesGroupListElement;
