import { injectCSSFile } from "../../utils/html";
import { PageTypeDetector } from "../app/page-type.js";
import { setupPageAlbum } from "../pages/page-album.js";
import { setupPageMusic } from "../pages/page-music.js";

export function main () {
  const pageType = (new PageTypeDetector()).detect();

  if (pageType.isMusic()) {
    setupPageMusic();
  } else if (pageType.isAlbum()) {
    setupPageAlbum();
  }

  injectCSSFile(chrome.runtime.getURL('src/bandcamp/styles.css'));
}

main();
