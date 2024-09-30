import { Metadata } from '../discogs/app/metadata.js';
import { releaseToDiscogsCsv } from '../discogs/modules/discogs.js';
import { logStorageData } from '../utils/storage';
import { log, logInfo } from '../utils/console';

export function setupConsole() {
  initConsole((consoleCommand) => {
    consoleCommand.addCommand('log.storage', () => {
      logStorageData();
    });
  });
}

/**
 * @param {Release} release
 * @param {Object} schema
 */
export function setupConsoleRelease(release, keywordsMapping, schema) {
  initConsole((consoleCommand) => {
    consoleCommand.addCommand('log.release', () => {
      log('Release:', release);
    });

    consoleCommand.addCommand('log.keywordsMapping', () => {
      log('Keywords mapping:', keywordsMapping);
    });

    const discogsCsv = releaseToDiscogsCsv(release);
    consoleCommand.addCommand('log.discogsCsv', () => {
      log('Discogs CSV:', discogsCsv);
    });

    const metadata = Metadata.fromRelease(release);
    consoleCommand.addCommand('log.metadata', () => {
      log('Release metadata:', metadata);
    });

    consoleCommand.addCommand('log.schema', () => {
      log('Bandcamp schema:', schema);
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
