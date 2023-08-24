import { Release } from "../../app/release.js";
import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectsToCsv } from "../../modules/csv.js";
import { isArray } from "../../modules/utils.js";

/**
 * @param {Element} btnDownload
 * @param {Array<Release>} releases
 */
export function setupDownloadReleasesAsCsv(btnDownload, releases) {
  if (!isArray(releases)) {
    return;
  }

  btnDownload.addEventListener('click', () => {
    const firstRelease = releases[0];
    const csvObjects = releases.map(release => DiscogsCsv.fromRelease(release).toCsvObject());
    const csv = objectsToCsv(csvObjects);

    downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
  });
}
