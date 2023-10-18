import { logStorage } from "../modules/storage.js";
import { injectCSSFile, injectJSFile } from "../modules/utils.js";
import { PageTypeDetector } from "./bandcamp.js";
import { setupPageAlbum } from "./page-album.js";
import { setupPageMusic } from "./page-music.js";

export function main () {
  logStorage();
  const pageType = (new PageTypeDetector()).detect();

  if (pageType.isMusic()) {
    setupPageMusic();
  } else if (pageType.isAlbum()) {
    setupPageAlbum();
  }

  injectJSFile(chrome.runtime.getURL('src/bandcamp/script.js'));
  injectCSSFile(chrome.runtime.getURL('src/bandcamp/styles.css'));
}
