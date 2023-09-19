class ReleasesList extends HTMLElement {
  constructor() {
    super();

    const self = this;
    const selectAllCheckboxId = self.getPrefixed('selectAllCheckbox');
    const searchInputId = self.getPrefixed('searchInput');
    const template = document.createElement('template');
    template.innerHTML = `
        <div class="content-header sticky-top">
          <input type="text" id="${searchInputId}" class="form-control form-control-sm rounded-0" placeholder="Search...">
          <div class="control-buttons btn-group btn-group-sm" role="group" aria-label="Control buttons">
          </div>
        </div>
        <table class="table table-hover table-sm table-transparent table-borderless">
          <thead>
            <tr>
              <th><input type="checkbox" id="${selectAllCheckboxId}" title="Select all"></th>
              <th>
                <label for="${selectAllCheckboxId}">
                  <span id="${selectAllCheckboxId}-info" class="selected-info" data-format="Selected: {selected}/{filtered}; Viewed: {filtered}/{total}"></span>
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
    `;

    self.appendChild(template.content.cloneNode(true));

    const selectAllCheckbox = self.querySelector("#"+selectAllCheckboxId);
    selectAllCheckbox.addEventListener("change", () => {
      self.selectAllCheckboxes(selectAllCheckbox.checked);
    });

    const table = self.querySelector(".table");
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
        self
          .selectCheckbox(target, target.checked)
          .refreshStatus();
      }
    });

    const searchInput = document.getElementById(searchInputId);
    searchInput.addEventListener("input", filterTable);

    function filterTable() {
      const input = searchInput.value.toLowerCase();
      const rows = table.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const label = row.querySelector("td label").textContent.toLowerCase();
        row.classList[label.includes(input) ? 'remove' : 'add']('visually-hidden');
      });

      self.refreshStatus();
    }
  }

  refreshStatus() {
    const self = this;
    self
      .updateButtonsState()
      .refreshItemsStatus();
    return self;
  }

  refreshItemsStatus() {
    const self = this;
    const total = self.querySelectorAll('tr.release-item').length;
    const selected = self.getSelectedValues().length;
    const filtered = self.querySelectorAll('tr.release-item:not(.visually-hidden)').length;
    const selectAllCheckboxId = self.getPrefixed('selectAllCheckbox');
    const selectedAmountInfo = document.getElementById(`${selectAllCheckboxId}-info`);
    const infoText = selectedAmountInfo.getAttribute("data-format")
      .replace(new RegExp("{total}", "g"), total)
      .replace(new RegExp("{selected}", "g"), selected)
      .replace(new RegExp("{filtered}", "g"), filtered);
    selectedAmountInfo.textContent = infoText;

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
      const className = 'table-active';

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

  /**
   * @param {Array} data
   * @returns {Self}
   */
  populateData(data) {
    const self = this;
    const tableBody = self.querySelector("tbody");
    tableBody.innerHTML = ""; // Clear existing data

    data.forEach((item, index) => {
      const row = document.createElement("tr");
      const checkboxId = self.getPrefixed('checkbox_'+index);
      row.classList.add('release-item');
      row.innerHTML = `
        <td><input type="checkbox" value="${item.value}" id="${checkboxId}" class="release-checkbox"></td>
        <td><label for="${checkboxId}">${item.title}</label></td>
      `;
      tableBody.appendChild(row);
    });

    self.refreshStatus();

    return self;
  }

  selectAllCheckboxes(checked) {
    const self = this;
    self.getCheckboxes().forEach(checkbox => {
      self.selectCheckbox(checkbox, checked);
    });
    return self;
  }

  getCheckboxes(onlyChecked = false) {
    return this.querySelectorAll(".release-item:not(.visually-hidden) input.release-checkbox[type='checkbox']" + (onlyChecked ? ":checked" : ""));
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
 updateButtonState(button) {
   const self = this;
   const checkboxes = self.getCheckboxes();
   const anyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
   button.disabled = !anyCheckboxChecked;
   return self;
  }

  updateButtonsState() {
    const self = this;
    self.querySelectorAll('[data-status-update]').forEach(button => self.updateButtonState(button));
    return self;
  }
}

customElements.define('releases-list', ReleasesList);
