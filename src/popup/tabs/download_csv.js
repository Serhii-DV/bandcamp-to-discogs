import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectToCsv } from "../../modules/csv.js";

/**
 * @param {Element} btnDownloadCsv
 */
export function setupDownloadCsvSingleRelease(btnDownloadCsv, release) {
  btnDownloadCsv.addEventListener('click', () => {
    const discogsCsv = DiscogsCsv.fromRelease(release);
    downloadCsv(
      objectToCsv(discogsCsv.toCsvObject()),
      `discogs-${release.artist}-${release.title}`
    );
  });
}
