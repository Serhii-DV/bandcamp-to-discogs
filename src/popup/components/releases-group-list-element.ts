import { Release } from 'src/app/release';
import { createElementFromHTML } from '../../utils/html';
import { VisitedDate } from '../../utils/storage';

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
    targetBlank: boolean = true
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
    self.#groupElement.appendChild(item);

    return item;
  }

  addRelease(release: Release, visitedDate: VisitedDate) {
    const self = this;
    const releaseContentElement = createElementFromHTML(`
<div class="d-flex justify-content-between">
  <div class="flex-shrink-0">
    <img src="${release.image}" alt="${release.year} - ${release.title}" class="img-fluid" style="width: 80px; height: 80px;">
  </div>
  <div class="flex-grow-1 ms-3">
    <div class="d-flex w-100 justify-content-between">
      <h6 class="release-artist mb-1">${release.artist}</h6>
      <relative-time class="release-visited-date text-body-secondary" datetime="${visitedDate.date.toISOString()}">${visitedDate.date.toLocaleString()}</relative-time>
    </div>
    <p class="release-title mb-0">${release.year} - ${release.title}</p>
    <small class="release-url text-body-secondary text-break">${release.hostname}</small>
  </div>
</div>`);
    if (releaseContentElement) {
      self.addItem(release.url, releaseContentElement, release.url);
    }

    return self;
  }
}

ReleasesGroupListElement.define();

export default ReleasesGroupListElement;
