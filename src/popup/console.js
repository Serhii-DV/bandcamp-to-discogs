import { Release } from "../app/release.js";
import { releaseToDiscogsCsv } from "../discogs/modules/discogs.js";
import { logStorage } from "../modules/storage.js";
import { logInfo } from "../utils/console.js";

export function setupConsole() {
  initConsole((consoleCommand) => {
    consoleCommand.addCommand('log.storage', () => { logStorage();});
  })
}

/**
 * @param {Release} release
 */
export function setupConsoleRelease(release, keywordsMapping) {
  initConsole((consoleCommand) => {
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
  });
}

function initConsole(onInit) {
  logInfo('Init console');

  // TODO: find a better solution
  // Wait for dashboard content load
  const interval = 100;
  const intervalId = setInterval(() => {
    const consoleCommand = document.querySelector('console-command');
    if (consoleCommand) {
      onInit(consoleCommand);
      logInfo('Console initialized');
      clearInterval(intervalId);
    }
  }, interval);
}
