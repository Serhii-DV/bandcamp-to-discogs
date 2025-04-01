import { log } from '../utils/console';
import { injectCSSFile, injectJSFile } from '../utils/html';
import { PageTypeDetector } from './app/page-type';
import { setupPageAlbum } from './pages/page-album.js';
import { setupPageMusic } from './pages/page-music.js';

import './css/b2d.css';
import { getExtensionUrl } from 'src/utils/chrome.js';

function main() {
  log('Running bandcamp content main module logic (bandcamp/modules/main.js)');
  injectCSSFile(getExtensionUrl('bandcamp.content.css'));
  injectJSFile(getExtensionUrl('bandcamp.inject.js'));

  const pageType = new PageTypeDetector().detect();

  if (pageType.isMusic()) {
    setupPageMusic(pageType);
  } else if (pageType.isAlbum()) {
    setupPageAlbum(pageType);
  }
}

main();
