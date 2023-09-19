import { Release } from "../../app/release.js";
import { DiscogsCsv } from "../../discogs/discogs-csv.js";
import { downloadCsv, objectsToCsv } from "../../modules/csv.js";
import { isEmptyArray } from "../../modules/utils.js";
import { disable, enable } from "../helpers.js";

/**
 * @param {Element} button
 * @param {Array<Release>} releases
 */
export function setupBtnToDownloadReleasesAsCsv(button, releases) {
  if (isEmptyArray(releases)) {
    disable(button);
    return;
  }

  enable(button).addEventListener('click', () => downloadReleasesCsv(releases));
}

/**
 * @param {Array<Release>} releases
 */
export function downloadReleasesCsv(releases) {
  if (isEmptyArray(releases)) {
    return;
  }

  const firstRelease = releases[0];
  const csvObjects = releases.map(release => DiscogsCsv.fromRelease(release).toCsvObject());
  const csv = objectsToCsv(csvObjects);

  downloadCsv(csv, `discogs-selected-releases-${firstRelease.artist}`);
}
