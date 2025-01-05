import { Metadata } from '../discogs/app/metadata';
import { releaseToDiscogsCsv } from '../discogs/modules/discogs.js';
import { log, logInfo } from '../utils/console';

export function setupConsoleLogStorage(storage) {
  setCommand('log.storage', () => {
    storage.log();
  });
}

/**
 * @param {Release} release
 */
export function setupConsoleLogRelease(release) {
  setCommand('log.release', () => {
    log('Console Release:', release);
  });

  setCommand('log.discogsCsv', () => {
    const discogsCsv = releaseToDiscogsCsv(release);
    log('Console Discogs CSV:', discogsCsv);
    console.table(discogsCsv.toCsvObject());
  });

  setCommand('log.metadata', () => {
    const metadata = Metadata.fromRelease(release);
    log('Console Release Metadata:', metadata);
  });
}

export function setupConsoleLogKeywordsMapping(keywordsMapping) {
  setCommand('log.keywordsMapping', () => {
    log('Console Keywords mapping:', keywordsMapping);
  });
}

/**
 * @param {Object} schema
 */
export function setupConsoleLogSchema(schema) {
  setCommand('log.schema', () => {
    log('Bandcamp schema:', schema);
  });
}

let consoleCommand;

function setCommand(command, handler) {
  if (consoleCommand) {
    setConsoleCommand(command, handler);
    return;
  }

  // TODO: find a better solution
  // Wait for dashboard content load
  const interval = 100;
  const intervalId = setInterval(() => {
    consoleCommand = document.querySelector('console-command');
    if (consoleCommand) {
      setConsoleCommand(command, handler);
      clearInterval(intervalId);
    }
  }, interval);
}

function setConsoleCommand(command, handler) {
  consoleCommand.setCommand(command, handler);
  logInfo('Set console command', command);
}
