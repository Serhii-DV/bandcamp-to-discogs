import { Release } from "../app/release.js";
import { releaseToDiscogsCsv } from "../discogs/modules/discogs.js";

const consoleCommand = document.querySelector('console-command');

export function setupConsole() {
  consoleCommand.addCommand('log.storage', () => { logStorage();});
}

/**
 * @param {Release} release
 */
export function setupConsoleRelease(release, keywordsMapping) {
  consoleCommand.addCommand('log.release', () => {
    console.log(release);
  });

  consoleCommand.addCommand('log.keywordsMapping', () => {
    console.log(keywordsMapping);
  });

  const discogsCsv = releaseToDiscogsCsv(release);
  consoleCommand.addCommand('log.discogsCsvNotes', () => {
    console.log(discogsCsv.notes);
  });
}
