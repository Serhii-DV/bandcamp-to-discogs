import { log } from '../utils/console';
import { injectCSSFile, injectJSFile } from '../utils/html';
import { PageTypeDetector } from './app/page-type.js';
import { setupPageAlbum } from './pages/page-album.js';
import { setupPageMusic } from './pages/page-music.js';
import { Storage } from '../app/core/storage';

import './css/b2d.css';

globalThis.storage = new Storage();

function main() {
  log('Running bandcamp content main module logic (bandcamp/modules/main.js)');
  injectCSSFile(chrome.runtime.getURL('bandcamp.content.css'));
  injectJSFile(chrome.runtime.getURL('bandcamp.inject.js'));

  const pageType = new PageTypeDetector().detect();

  if (pageType.isMusic()) {
    setupPageMusic(pageType);
  } else if (pageType.isAlbum()) {
    setupPageAlbum(pageType);
  }
}

main();
