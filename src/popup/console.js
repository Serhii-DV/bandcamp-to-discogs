export function setupConsole() {
  const consoleCommand = document.querySelector('console-command');
  consoleCommand.addCommand('log.storage', () => { logStorage();});
}
