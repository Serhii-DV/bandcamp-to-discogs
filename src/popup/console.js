import { Release } from "../app/release.js";
import { releaseToDiscogsCsv } from "../discogs/modules/discogs.js";
import { logStorage } from "../modules/storage.js";
import { log, logInfo } from "../utils/console.js";

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
      log('Release:', release)
    });

    consoleCommand.addCommand('log.keywordsMapping', () => {
      log('Keywords mapping:', keywordsMapping);
    });

    const discogsCsv = releaseToDiscogsCsv(release);
    consoleCommand.addCommand('log.discogsCsvNotes', () => {
      log('Discogs CSV notes:', discogsCsv.notes);
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
