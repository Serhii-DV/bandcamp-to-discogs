import { Release } from '../../app/release';
import { createElementFromHTML } from '../../utils/html';
import { showReleaseCardTab } from '../modules/main';
import { ReleaseItem } from '../../app/releaseItem';
import { ArtistItem } from '../../app/artistItem';
import { BandcampItem } from '../../app/bandcampItem';

const HTMLElement =
  globalThis.HTMLElement || (null as unknown as (typeof window)['HTMLElement']);

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
    url: string,
    content: string | Element,
    title: string = '',
    targetBlank: boolean = true,
    onClick: ((event: Event) => void) | null = null
  ): Element | null {
    const self = this;
    const item = createElementFromHTML(
      `<a href="${url}" class="list-group-item list-group-item-action" title="${title}"${targetBlank ? ' target="_blank"' : ''}></a>`
    );

    if (self.#groupElement === null || item === null) {
      return null;
    }

    if (content instanceof Element) {
      item.appendChild(content);
    } else {
      item.textContent = content;
    }

    if (onClick !== null) {
      item.addEventListener('click', onClick);
    }

    self.#groupElement.appendChild(item);

    return item;
  }

  add(item: BandcampItem | Release) {
    const self = this;

    if (item instanceof BandcampItem) {
      return self.addBandcampItem(item);
    } else if (item instanceof Release) {
      return self.addRelease(item);
    }

    return self;
  }

  addBandcampItem(item: BandcampItem) {
    const self = this;

    if (item instanceof ArtistItem) {
      return self.addArtistItem(item);
    } else if (item instanceof ReleaseItem) {
      return self.addReleaseItem(item);
    }

    return self;
  }

  addBandcampItems(items: BandcampItem[]) {
    const self = this;
    items.forEach((item) => self.addBandcampItem(item));
    return self;
  }

  addArtistItem(item: ArtistItem) {
    const self = this;
    const artist = item.name;
    const title = item.name;
    const url = item.url;
    const image = '';
    const visit = item.visit ?? new Date(0);
    const artistHostname = item.artistHostname;

    const contentElement = createElementFromHTML(`
      <div class="d-flex justify-content-between">
        <div class="flex-shrink-0">
          <svg class="bd-placeholder-img img-fluid" width="80" height="80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false">
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#868e96"></rect>
            <text x="25%" y="50%" fill="#dee2e6" dy=".3em">Artist</text>
          </svg>
          <!--img src="${image}" alt="${title}" class="img-fluid" style="width: 80px; height: 80px;"-->
        </div>
        <div class="flex-grow-1 ms-3">
          <div class="d-flex w-100 justify-content-between">
            <h6 class="release-artist mb-1">${artist}</h6>
            <relative-time class="release-visited-date text-body-secondary" datetime="${visit.toISOString()}">${visit.toLocaleString()}</relative-time>
          </div>
          <p class="release-title mb-0">${title}</p>
          <small class="release-url text-body-secondary text-break">${artistHostname}</small>
        </div>
      </div>`);

    if (contentElement) {
      self.addItem(url, contentElement, url, false, (event: Event) => {
        // showReleaseCardTab(release);
        event.preventDefault();
      });
    }

    return self;
  }

  addReleaseItem(item: ReleaseItem) {
    const self = this;

    const artist = item.artist;
    const title = `${item.title}`;
    const url = item.url;
    const image = '';
    const visit = item.visit ?? new Date(0);
    const artistHostname = item.artistHostname;

    const contentElement = createElementFromHTML(`
      <div class="d-flex justify-content-between">
        <div class="flex-shrink-0">
          <img src="${image}" alt="${title}" class="img-fluid" style="width: 80px; height: 80px;">
        </div>
        <div class="flex-grow-1 ms-3">
          <div class="d-flex w-100 justify-content-between">
            <h6 class="release-artist mb-1">${artist}</h6>
            <relative-time class="release-visited-date text-body-secondary" datetime="${visit.toISOString()}">${visit.toLocaleString()}</relative-time>
          </div>
          <p class="release-title mb-0">${title}</p>
          <small class="release-url text-body-secondary text-break">${artistHostname}</small>
        </div>
      </div>`);

    if (contentElement) {
      self.addItem(url, contentElement, url, false, (event: Event) => {
        // showReleaseCardTab(release);
        event.preventDefault();
      });
    }

    return self;
  }

  addRelease(release: Release) {
    const self = this;

    const artist = release.artist;
    const title = `${release.title} (${release.year})`;
    const url = release.url;
    const image = release.image;
    const visit = release.releaseItem.visit ?? new Date(0);
    const artistHostname = release.artistHostname;

    const contentElement = createElementFromHTML(`
<div class="d-flex justify-content-between">
  <div class="flex-shrink-0">
    <img src="${image}" alt="${title}" class="img-fluid" style="width: 80px; height: 80px;">
  </div>
  <div class="flex-grow-1 ms-3">
    <div class="d-flex w-100 justify-content-between">
      <h6 class="release-artist mb-1">${artist}</h6>
      <relative-time class="release-visited-date text-body-secondary" datetime="${visit.toISOString()}">${visit.toLocaleString()}</relative-time>
    </div>
    <p class="release-title mb-0">${title}</p>
    <small class="release-url text-body-secondary text-break">${artistHostname}</small>
  </div>
</div>`);
    if (contentElement) {
      self.addItem(url, contentElement, url, false, (event: Event) => {
        showReleaseCardTab(release);
        event.preventDefault();
      });
    }

    return self;
  }

  addReleases(releases: Release[]) {
    const self = this;
    releases.forEach((release) => self.addRelease(release));
    return self;
  }
}

ReleasesGroupListElement.define();

export default ReleasesGroupListElement;
