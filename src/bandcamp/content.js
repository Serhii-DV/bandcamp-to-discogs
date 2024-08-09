import { log } from "../utils/console";
import { injectCSSFile } from "../utils/html";
import { PageTypeDetector } from "./app/page-type.js";
import { setupPageAlbum } from "./pages/page-album.js";
import { setupPageMusic } from "./pages/page-music.js";

import './css/b2d.css';

function main () {
  log('Running bandcamp content main module logic (bandcamp/modules/main.js)');
  injectCSSFile(chrome.runtime.getURL('bandcamp.content.css'));

  const pageType = (new PageTypeDetector()).detect();

  if (pageType.isMusic()) {
    setupPageMusic();
  } else if (pageType.isAlbum()) {
    setupPageAlbum();
  }
}

main();
