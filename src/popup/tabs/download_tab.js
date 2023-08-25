import { Release } from "../../app/release.js";
import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectsToCsv } from "../../modules/csv.js";
import { disable, enable, isArray } from "../../modules/utils.js";

/**
 * @param {Element} btnDownload
 * @param {Array<Release>} releases
 */
export function setupDownloadReleasesAsCsv(btnDownload, releases) {
  if (!isArray(releases)) {
    disable(btnDownload);
    return;
  }

  enable(btnDownload).addEventListener('click', () => downloadReleasesCsv(releases));
}

export function downloadReleasesCsv(releases) {
  const firstRelease = releases[0];
  const csvObjects = releases.map(release => DiscogsCsv.fromRelease(release).toCsvObject());
  const csv = objectsToCsv(csvObjects);

  downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
}
