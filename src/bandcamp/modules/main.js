import { logStorage } from "../../modules/storage.js";
import { injectCSSFile, injectJSFile } from "../../modules/utils.js";
import { PageTypeDetector } from "./bandcamp.js";
import { setupPageAlbum } from "../pages/page-album.js";
import { setupPageMusic } from "../pages/page-music.js";

export function main () {
  logStorage();
  const pageType = (new PageTypeDetector()).detect();

  if (pageType.isMusic()) {
    setupPageMusic();
  } else if (pageType.isAlbum()) {
    setupPageAlbum();
  }

  injectCSSFile(chrome.runtime.getURL('src/bandcamp/styles.css'));
}
