class ExternalContent extends HTMLElement {
  constructor() {
    super();
    const href = this.getAttribute('href');
    this.loadExternalContent(href);
  }

  async loadExternalContent(href) {
    try {
      const response = await fetch(href);
      const content = await response.text();
      this.innerHTML = content;
      this.dispatchEvent(new CustomEvent('externalContentLoaded'));
    } catch (error) {
      console.error('Error loading external content:', error);
    }
  }
}

customElements.define('external-content', ExternalContent);
