import { DiscogsCsv } from '../../discogs/app/discogs-csv';
import { downloadCsv, objectsToCsv } from '../../utils/csv';
import { isEmptyArray } from '../../utils/utils';
import { disable, enable } from '../../utils/html';

/**
 * @param {Element} button
 * @param {Array<Release>} releases
 */
export function setupBtnToDownloadReleasesAsCsv(button, releases) {
  if (isEmptyArray(releases)) {
    disable(button);
    return;
  }

  enable(button);
  button.addEventListener('click', () => downloadReleasesCsv(releases));
}

/**
 * @param {Array<Release>} releases
 */
export function downloadReleasesCsv(releases) {
  if (isEmptyArray(releases)) {
    return;
  }

  const firstRelease = releases[0];
  const csvObjects = releases.map((release) =>
    DiscogsCsv.fromRelease(release).toCsvObject()
  );
  const csv = objectsToCsv(csvObjects);

  const filename =
    releases.length > 1
      ? `discogs-selected-releases-${firstRelease.artist}`
      : `discogs-releases-${firstRelease.artist}-${firstRelease.title}`;

  downloadCsv(csv, filename);
}
