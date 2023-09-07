class ReleasesList extends HTMLElement {
  constructor() {
    super();

    const selectAllCheckboxId = this.getPrefixed('selectAllCheckbox');
    const template = document.createElement('template');
    template.innerHTML = `
        <table class="table table-hover table-sm table-transparent">
          <thead>
            <tr>
              <th><input type="checkbox" id="${selectAllCheckboxId}"></th>
              <th><label for="${selectAllCheckboxId}">Select All</label><span id="${selectAllCheckboxId}-info" data-format=" (selected: {amount})"></span></th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
        <div class="fixed-bottom buttons">
          <div class="control-buttons btn-group btn-group-sm" role="group" aria-label="Control buttons">
          </div>
        </div>
    `;

    this.appendChild(template.content.cloneNode(true));

    const selectAllCheckbox = this.querySelector("#"+selectAllCheckboxId);
    selectAllCheckbox.addEventListener("change", () => {
      this.selectAllCheckboxes(selectAllCheckbox.checked);
    });

    const table = this.querySelector(".table");
    table.addEventListener("click", event => {
      const target = event.target;
      if (target.nodeName === 'TD') {
        const parentTr = target.parentElement;
        const checkbox = parentTr.querySelector("input[type='checkbox']");
        if (checkbox && !target.matches("label")) {
          checkbox.click();
        }
      }
    });
    table.addEventListener('change', event => {
      const target = event.target;
      if (target.type === 'checkbox') {
        this.selectCheckbox(target, target.checked);
        this.setSelectedAmount(this.getSelectedValues().length);
      }
    });
  }

  setSelectedAmount(amount) {
    const self = this;
    const selectAllCheckboxId = self.getPrefixed('selectAllCheckbox');
    const selectedAmountInfo = document.getElementById(`${selectAllCheckboxId}-info`);
    const updatedText = amount ? selectedAmountInfo.getAttribute("data-format").replace("{amount}", amount) : '';
    selectedAmountInfo.textContent = updatedText;
    return self;
  }

  getPrefix() {
    return this.id;
  }

  getPrefixed(str) {
    return this.getPrefix() + '__' + str ?? '';
  }

  /**
   * @param {Element|Array<Element>} button
   * @returns {ReleasesList}
   */
  appendButton(...button) {
    const controlButtons = this.querySelector(".control-buttons");
    button.forEach(el => controlButtons.appendChild(el));
    return this;
  }

  /**
   * @param {Element} checkbox
   * @param {Boolean} checked
   * @returns {ReleasesList}
   */
  selectCheckbox(checkbox, checked) {
    if (checkbox.type !== 'checkbox') {
      return this;
    }

    checkbox.checked = checked;

    if (checkbox.classList.contains('release-checkbox')) {
      const tr = checkbox.closest('tr');
      const className = 'selected';

      if (checkbox.checked) {
        tr.classList.add(className);
      } else {
        tr.classList.remove(className);
      }
    }
    return this;
  }

  connectedCallback() {
    const dataAttr = this.getAttribute("data");
    const data = dataAttr ? JSON.parse(dataAttr) : [];
    this.populateData(data);
  }

  populateData(data) {
    const tableBody = this.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item, index) => {
      const row = document.createElement("tr");
      const checkboxId = this.getPrefixed('checkbox_'+index);
      row.innerHTML = `
        <td><input type="checkbox" value="${item.value}" id="${checkboxId}" class="release-checkbox"></td>
        <td><label for="${checkboxId}">${item.title}</label></td>
      `;
      tableBody.appendChild(row);
    });
    return this;
  }

  selectAllCheckboxes(checked) {
    this.getCheckboxes().forEach(checkbox => {
      this.selectCheckbox(checkbox, checked);
    });
    return this;
  }

  getCheckboxes(onlyChecked = false) {
    return this.querySelectorAll("input.release-checkbox[type='checkbox']" + (onlyChecked ? ":checked" : ""));
  }

  /**
   * @returns {Array}
   */
  getSelectedValues() {
    return Array.from(this.getCheckboxes(true)).map(checkbox => checkbox.value);
  }

  getSelectedTitles() {
    return Array.from(this.getCheckboxes(true)).map(checkbox => checkbox.nextElementSibling.textContent);
  }

  /**
   * @param {Element} button
   * @returns {ReleasesList}
   */
  setupButtonState(button) {
    const self = this;
    const checkboxes = self.getCheckboxes();

    checkboxes.forEach(checkbox => checkbox.addEventListener('click', () => {
      self.updateButtonState(button);
    }));
    self.updateButtonState(button);

    return self;
  }

  /**
   * @param {Element} btn
   * @returns {ReleasesList}
   */
  updateButtonState(button) {
    const self = this;
    const checkboxes = self.getCheckboxes();
    const anyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    button.disabled = !anyCheckboxChecked;
    return self;
  }

  /**
   * @param {Element} button
   * @param {CallableFunction} onClick
   * @returns {ReleasesList}
   */
  setupButton(button, onClick) {
    const self = this;
    self.setupButtonState(button);
    button.addEventListener('click', onClick);
    return self;
  }
}

customElements.define('releases-list', ReleasesList);
