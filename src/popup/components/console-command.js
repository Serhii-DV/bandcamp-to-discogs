class ConsoleCommand extends HTMLElement {
  constructor() {
    super();

    const self = this;
    self.commands = {};

    const shadow = self.attachShadow({ mode: 'open' });
    const template = document.createElement('template');
    template.innerHTML = `
<style>
  #console {
    width: 250px;
    margin: 0 auto;
  }

  #console input {
    width: 100%;
  }
</style>
<div id="console">
  <input type="text" placeholder="Type command here..." aria-label="Console command" list="command-list">
  <datalist id="command-list"></datalist>
</div>
`;

    shadow.appendChild(template.content.cloneNode(true));

    self.inputElement = shadow.querySelector('input');
    self.inputElement.addEventListener("input", event => {
      self.runCommand(self.inputElement.value);
    });
    self.inputElement.addEventListener("keypress", event => {
      if (event.key === "Enter") {
        self.runCommand(event.target.value);
      }
    });

    self.datalist = self.shadowRoot.querySelector('#command-list');
  }

  addCommand(commandName, handler) {
    const self = this;
    self.commands[commandName] = handler;

    const option = document.createElement('option');
    option.value = commandName;
    self.datalist.appendChild(option);

    return self;
  }

  runCommand(commandName) {
    const self = this;
    if (self.commands[commandName]) {
      self.commands[commandName]();
      self.inputElement.value = '';
    }
    return self;
  }

  focusInput() {
    this.inputElement.focus();
  }
}

customElements.define('console-command', ConsoleCommand);

(() => {
  const consoleCommand = document.createElement('console-command');
  consoleCommand.style.display = "none";
  document.body.appendChild(consoleCommand);

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key === "`") {
      consoleCommand.style.display = consoleCommand.style.display === "none" ? "block" : "none";
      consoleCommand.focusInput();
    }
  });
})();
